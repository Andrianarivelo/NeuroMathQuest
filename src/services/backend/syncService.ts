import { LessonProgressRow, QuizAttemptRow, progressRepository } from '../../repositories/progressRepository';
import { LessonUnlockRow, lessonUnlocksRepository } from '../../repositories/lessonUnlocksRepository';
import { rewardsRepository, Wallet } from '../../repositories/rewardsRepository';
import { settingsRepository } from '../../repositories/settingsRepository';
import { StreakDay, streakRepository } from '../../repositories/streakRepository';
import { MasteryLevel } from '../masteryService';
import { ensureInstallId } from './installId';
import { getCloudProfile, getCloudUser, isCloudAdmin, upsertCloudProfile } from './authService';
import { getSupabaseClient, isBackendConfigured } from './supabaseClient';

type SyncStatus = 'disabled' | 'guest' | 'synced' | 'error';

export interface SyncResult {
  status: SyncStatus;
  message: string;
  uploaded?: {
    progress: number;
    attempts: number;
    streakDays: number;
    unlocks: number;
  };
}

interface CloudProgressRow extends LessonProgressRow {
  user_id: string;
}

interface CloudStreakRow {
  user_id: string;
  day: string;
  lessons_completed: number;
  xp_earned: number;
}

interface CloudLessonUnlockRow extends LessonUnlockRow {
  user_id: string;
}

export interface CloudAdminStats {
  students: number;
  quizAttempts: number;
  lessonsStarted: number;
  averageScore: number;
  activeUsers7d: number;
  usageEvents: number;
  weakLessons: Array<{
    lessonId: string;
    learners: number;
    averageBestScore: number;
  }>;
}

const masteryRank: Record<MasteryLevel, number> = {
  not_started: 0,
  beginner: 1,
  practicing: 2,
  strong: 3,
  mastered: 4,
};

export async function syncLocalProgressToCloud(): Promise<SyncResult> {
  const supabase = getSupabaseClient();
  if (!supabase || !isBackendConfigured()) {
    return { status: 'disabled', message: 'Cloud sync is not configured. Guest mode is active.' };
  }

  const user = await getCloudUser();
  if (!user) {
    return { status: 'guest', message: 'Guest mode is active. Sign in to back up progress.' };
  }

  try {
    const settings = settingsRepository.getAll();
    const wallet = rewardsRepository.get();
    await upsertCloudProfile(settings.profileName);
    await upsertCloudWallet(wallet);

    const remoteProgress = await fetchCloudProgress();
    mergeRemoteProgress(remoteProgress);
    const mergedProgress = progressRepository.getAll();

    const remoteStreak = await fetchCloudStreak();
    mergeRemoteStreak(remoteStreak);
    const mergedStreak = streakRepository.recent(365);

    const remoteUnlocks = await fetchCloudLessonUnlocks();
    mergeRemoteUnlocks(remoteUnlocks);
    const mergedUnlocks = lessonUnlocksRepository.getAll();

    const attempts = progressRepository.getAttempts();
    const installId = ensureInstallId();

    await uploadProgress(mergedProgress);
    await uploadAttempts(attempts, installId);
    await uploadStreak(mergedStreak);
    await uploadLessonUnlocks(mergedUnlocks);

    settingsRepository.set('cloudSyncLastAt', Date.now());
    await recordUsageEvent('sync_completed');

    return {
      status: 'synced',
      message: 'Cloud sync complete. Guest mode remains available on this device.',
      uploaded: {
        progress: mergedProgress.length,
        attempts: attempts.length,
        streakDays: mergedStreak.length,
        unlocks: mergedUnlocks.length,
      },
    };
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Cloud sync failed.',
    };
  }
}

export async function recordUsageEvent(eventType: string): Promise<void> {
  const supabase = getSupabaseClient();
  const user = await getCloudUser();
  if (!supabase || !user) return;

  await supabase.from('usage_events').insert({
    user_id: user.id,
    event_type: eventType,
    created_at: new Date().toISOString(),
  });
}

export async function getCloudAdminStats(): Promise<CloudAdminStats | null> {
  const supabase = getSupabaseClient();
  if (!supabase || !(await isCloudAdmin())) return null;

  const [profiles, progress, attempts, usage] = await Promise.all([
    supabase.from('profiles').select('user_id, role'),
    supabase.from('lesson_progress').select('user_id, lesson_id, mastery, best_score'),
    supabase.from('quiz_attempts').select('user_id, lesson_id, score, attempted_at').limit(10000),
    supabase.from('usage_events').select('user_id, event_type, created_at').limit(10000),
  ]);

  if (profiles.error) throw profiles.error;
  if (progress.error) throw progress.error;
  if (attempts.error) throw attempts.error;
  if (usage.error) throw usage.error;

  const progressRows = progress.data ?? [];
  const attemptRows = attempts.data ?? [];
  const usageRows = usage.data ?? [];
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const activeUsers = new Set(
    usageRows
      .filter((row) => new Date(row.created_at).getTime() >= sevenDaysAgo)
      .map((row) => row.user_id)
  );

  const weakByLesson = new Map<string, { learners: number; scoreSum: number }>();
  for (const row of progressRows) {
    if (row.mastery !== 'beginner' && row.mastery !== 'practicing') continue;
    const current = weakByLesson.get(row.lesson_id) ?? { learners: 0, scoreSum: 0 };
    current.learners += 1;
    current.scoreSum += Number(row.best_score ?? 0);
    weakByLesson.set(row.lesson_id, current);
  }

  const weakLessons = [...weakByLesson.entries()]
    .map(([lessonId, value]) => ({
      lessonId,
      learners: value.learners,
      averageBestScore: value.learners > 0 ? value.scoreSum / value.learners : 0,
    }))
    .sort((a, b) => a.averageBestScore - b.averageBestScore)
    .slice(0, 8);

  const averageScore =
    attemptRows.length > 0
      ? attemptRows.reduce((sum, row) => sum + Number(row.score ?? 0), 0) / attemptRows.length
      : 0;

  return {
    students: profiles.data?.filter((row) => row.role === 'student').length ?? 0,
    quizAttempts: attemptRows.length,
    lessonsStarted: progressRows.length,
    averageScore,
    activeUsers7d: activeUsers.size,
    usageEvents: usageRows.length,
    weakLessons,
  };
}

async function upsertCloudWallet(wallet: Wallet): Promise<void> {
  const supabase = getSupabaseClient();
  const user = await getCloudUser();
  if (!supabase || !user) return;

  const remote = await getCloudProfile();
  const merged = {
    xp_total: Math.max(wallet.xpTotal, remote?.xp_total ?? 0),
    // Coin balance can decrease when a learner buys lesson unlocks, so local
    // balance is authoritative here. XP and chest counts only increase.
    coins_total: wallet.coinsTotal,
    chests_opened: Math.max(wallet.chestsOpened, remote?.chests_opened ?? 0),
    level: Math.max(wallet.level, remote?.level ?? 1),
  };

  rewardsRepository.replace({
    xpTotal: merged.xp_total,
    coinsTotal: merged.coins_total,
    chestsOpened: merged.chests_opened,
    level: merged.level,
  });

  const { error } = await supabase
    .from('profiles')
    .update({ ...merged, updated_at: new Date().toISOString() })
    .eq('user_id', user.id);
  if (error) throw error;
}

async function fetchCloudProgress(): Promise<CloudProgressRow[]> {
  const supabase = getSupabaseClient();
  const user = await getCloudUser();
  if (!supabase || !user) return [];

  const { data, error } = await supabase
    .from('lesson_progress')
    .select('user_id, lesson_id, track_id, attempts, best_score, last_score, stars, mastery, last_attempt_at, completed_at')
    .eq('user_id', user.id);
  if (error) throw error;
  return (data ?? []) as CloudProgressRow[];
}

async function fetchCloudStreak(): Promise<CloudStreakRow[]> {
  const supabase = getSupabaseClient();
  const user = await getCloudUser();
  if (!supabase || !user) return [];

  const { data, error } = await supabase
    .from('streak_log')
    .select('user_id, day, lessons_completed, xp_earned')
    .eq('user_id', user.id);
  if (error) throw error;
  return (data ?? []) as CloudStreakRow[];
}

async function fetchCloudLessonUnlocks(): Promise<CloudLessonUnlockRow[]> {
  const supabase = getSupabaseClient();
  const user = await getCloudUser();
  if (!supabase || !user) return [];

  const { data, error } = await supabase
    .from('lesson_unlocks')
    .select('user_id, lesson_id, cost_paid, unlocked_at')
    .eq('user_id', user.id);
  if (error) throw error;
  return (data ?? []) as CloudLessonUnlockRow[];
}

function mergeRemoteProgress(remoteRows: CloudProgressRow[]): void {
  for (const remote of remoteRows) {
    const local = progressRepository.getByLesson(remote.lesson_id);
    if (!local) {
      progressRepository.upsert(remote);
      continue;
    }

    const localLast = local.last_attempt_at ?? 0;
    const remoteLast = remote.last_attempt_at ?? 0;
    const mastery =
      masteryRank[remote.mastery] > masteryRank[local.mastery] ? remote.mastery : local.mastery;
    progressRepository.upsert({
      lesson_id: remote.lesson_id,
      track_id: remote.track_id || local.track_id,
      attempts: Math.max(local.attempts, remote.attempts),
      best_score: Math.max(local.best_score, Number(remote.best_score)),
      last_score: remoteLast > localLast ? Number(remote.last_score) : local.last_score,
      stars: Math.max(local.stars, remote.stars),
      mastery,
      last_attempt_at: Math.max(localLast, remoteLast) || null,
      completed_at: earliestTimestamp(local.completed_at, remote.completed_at),
    });
  }
}

function mergeRemoteStreak(remoteRows: CloudStreakRow[]): void {
  for (const remote of remoteRows) {
    streakRepository.upsertDay(remote.day, remote.lessons_completed, remote.xp_earned);
  }
}

function mergeRemoteUnlocks(remoteRows: CloudLessonUnlockRow[]): void {
  for (const remote of remoteRows) {
    if (lessonUnlocksRepository.isPurchased(remote.lesson_id)) continue;
    lessonUnlocksRepository.add(remote.lesson_id, remote.cost_paid, remote.unlocked_at);
  }
}

async function uploadProgress(rows: LessonProgressRow[]): Promise<void> {
  const supabase = getSupabaseClient();
  const user = await getCloudUser();
  if (!supabase || !user || rows.length === 0) return;

  const { error } = await supabase.from('lesson_progress').upsert(
    rows.map((row) => ({
      user_id: user.id,
      lesson_id: row.lesson_id,
      track_id: row.track_id,
      attempts: row.attempts,
      best_score: row.best_score,
      last_score: row.last_score,
      stars: row.stars,
      mastery: row.mastery,
      last_attempt_at: row.last_attempt_at,
      completed_at: row.completed_at,
      updated_at: new Date().toISOString(),
    })),
    { onConflict: 'user_id,lesson_id' }
  );
  if (error) throw error;
}

async function uploadAttempts(rows: QuizAttemptRow[], installId: string): Promise<void> {
  const supabase = getSupabaseClient();
  const user = await getCloudUser();
  if (!supabase || !user || rows.length === 0) return;

  const { error } = await supabase.from('quiz_attempts').upsert(
    rows.map((row) => ({
      user_id: user.id,
      client_attempt_id: `${installId}:${row.id}`,
      lesson_id: row.lesson_id,
      correct: row.correct,
      total: row.total,
      score: row.score,
      xp_awarded: row.xp_awarded,
      coins_awarded: row.coins_awarded,
      attempted_at: row.attempted_at,
    })),
    { onConflict: 'user_id,client_attempt_id' }
  );
  if (error) throw error;
}

async function uploadStreak(rows: StreakDay[]): Promise<void> {
  const supabase = getSupabaseClient();
  const user = await getCloudUser();
  if (!supabase || !user || rows.length === 0) return;

  const { error } = await supabase.from('streak_log').upsert(
    rows.map((row) => ({
      user_id: user.id,
      day: row.day,
      lessons_completed: row.lessonsCompleted,
      xp_earned: row.xpEarned,
      updated_at: new Date().toISOString(),
    })),
    { onConflict: 'user_id,day' }
  );
  if (error) throw error;
}

async function uploadLessonUnlocks(rows: LessonUnlockRow[]): Promise<void> {
  const supabase = getSupabaseClient();
  const user = await getCloudUser();
  if (!supabase || !user || rows.length === 0) return;

  const { error } = await supabase.from('lesson_unlocks').upsert(
    rows.map((row) => ({
      user_id: user.id,
      lesson_id: row.lesson_id,
      cost_paid: row.cost_paid,
      unlocked_at: row.unlocked_at,
      updated_at: new Date().toISOString(),
    })),
    { onConflict: 'user_id,lesson_id' }
  );
  if (error) throw error;
}

function earliestTimestamp(left: number | null, right: number | null): number | null {
  if (left == null) return right;
  if (right == null) return left;
  return Math.min(left, right);
}
