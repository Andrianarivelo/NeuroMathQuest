import { LessonProgressRow, QuizAttemptRow, progressRepository } from '../../repositories/progressRepository';
import { LessonUnlockRow, lessonUnlocksRepository } from '../../repositories/lessonUnlocksRepository';
import { rewardsRepository, Wallet } from '../../repositories/rewardsRepository';
import { settingsRepository } from '../../repositories/settingsRepository';
import { StreakDay, streakRepository } from '../../repositories/streakRepository';
import { allLessons, getTrackLessons, tracks } from '../../content/tracks';
import { TrackId } from '../../content/types';
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

interface CloudProfileAdminRow {
  user_id: string;
  display_name: string;
  role: 'student' | 'admin';
  xp_total: number;
  coins_total: number;
  chests_opened: number;
  level: number;
  updated_at: string;
}

interface CloudProgressAdminRow extends CloudProgressRow {
  updated_at: string;
}

interface CloudQuizAttemptAdminRow {
  user_id: string;
  lesson_id: string;
  correct: number;
  total: number;
  score: number;
  xp_awarded: number;
  coins_awarded: number;
  attempted_at: number;
  created_at: string;
}

interface CloudUsageEventAdminRow {
  user_id: string;
  event_type: string;
  created_at: string;
}

interface CloudStreakAdminRow extends CloudStreakRow {
  updated_at: string;
}

interface CloudLessonUnlockAdminRow extends CloudLessonUnlockRow {
  updated_at: string;
}

export interface CloudAdminTrackProgress {
  trackId: TrackId;
  title: string;
  started: number;
  completed: number;
  mastered: number;
  total: number;
  averageBestScore: number;
}

export interface CloudAdminStudentLessonProgress {
  lessonId: string;
  title: string;
  trackId: TrackId;
  order: number;
  mastery: string;
  attempts: number;
  bestScore: number;
  lastScore: number;
  stars: number;
  completedAt: number | null;
  lastAttemptAt: number | null;
}

export interface CloudAdminStudentAttempt {
  lessonId: string;
  title: string;
  score: number;
  correct: number;
  total: number;
  attemptedAt: number;
}

export interface CloudAdminStudentSummary {
  userId: string;
  displayName: string;
  role: 'student' | 'admin';
  level: number;
  xpTotal: number;
  coinsTotal: number;
  chestsOpened: number;
  lessonsStarted: number;
  completedLessons: number;
  masteredLessons: number;
  unlockedLessons: number;
  quizAttempts: number;
  averageBestScore: number;
  averageQuizScore: number;
  activeDays: number;
  lastSeenAt: string | null;
  lastSyncAt: string | null;
  connectionStatus: 'active_today' | 'active_7d' | 'inactive' | 'unknown';
  connectionLabel: string;
  trackProgress: CloudAdminTrackProgress[];
  weakLessons: CloudAdminStudentLessonProgress[];
  lessonProgress: CloudAdminStudentLessonProgress[];
  recentAttempts: CloudAdminStudentAttempt[];
}

export interface CloudAdminLessonStats {
  lessonId: string;
  title: string;
  trackId: TrackId;
  order: number;
  startedLearners: number;
  completedLearners: number;
  masteredLearners: number;
  weakLearners: number;
  quizAttempts: number;
  averageBestScore: number;
  averageAttemptScore: number;
  completionRate: number;
  masteryRate: number;
  weakRate: number;
  lastAttemptAt: number | null;
}

export interface CloudAdminStats {
  students: number;
  quizAttempts: number;
  lessonsStarted: number;
  averageScore: number;
  activeUsersToday: number;
  activeUsers7d: number;
  usageEvents: number;
  averageCompletionRate: number;
  averageMasteryRate: number;
  studentsList: CloudAdminStudentSummary[];
  lessonStats: CloudAdminLessonStats[];
  weakLessons: Array<{
    lessonId: string;
    title: string;
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
    return { status: 'disabled', message: 'Cloud accounts are not ready yet. Guest mode is active.' };
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

  const [profiles, progress, attempts, usage, streak, unlocks] = await Promise.all([
    supabase
      .from('profiles')
      .select('user_id, display_name, role, xp_total, coins_total, chests_opened, level, updated_at')
      .limit(10000),
    supabase
      .from('lesson_progress')
      .select('user_id, lesson_id, track_id, attempts, best_score, last_score, stars, mastery, last_attempt_at, completed_at, updated_at')
      .limit(50000),
    supabase
      .from('quiz_attempts')
      .select('user_id, lesson_id, correct, total, score, xp_awarded, coins_awarded, attempted_at, created_at')
      .limit(50000),
    supabase.from('usage_events').select('user_id, event_type, created_at').limit(10000),
    supabase.from('streak_log').select('user_id, day, lessons_completed, xp_earned, updated_at').limit(50000),
    supabase.from('lesson_unlocks').select('user_id, lesson_id, cost_paid, unlocked_at, updated_at').limit(50000),
  ]);

  if (profiles.error) throw profiles.error;
  if (progress.error) throw progress.error;
  if (attempts.error) throw attempts.error;
  if (usage.error) throw usage.error;
  if (streak.error) throw streak.error;
  if (unlocks.error) throw unlocks.error;

  const profileRows = (profiles.data ?? []) as CloudProfileAdminRow[];
  const progressRows = (progress.data ?? []) as CloudProgressAdminRow[];
  const attemptRows = (attempts.data ?? []) as CloudQuizAttemptAdminRow[];
  const usageRows = (usage.data ?? []) as CloudUsageEventAdminRow[];
  const streakRows = (streak.data ?? []) as CloudStreakAdminRow[];
  const unlockRows = (unlocks.data ?? []) as CloudLessonUnlockAdminRow[];
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const learnerRows = profileRows.filter((row) => row.role === 'student');
  const learnerIds = new Set(learnerRows.map((row) => row.user_id));
  const activeUsers = new Set(
    usageRows
      .filter((row) => learnerIds.has(row.user_id) && new Date(row.created_at).getTime() >= sevenDaysAgo)
      .map((row) => row.user_id)
  );
  const activeUsersToday = new Set(
    usageRows
      .filter((row) => learnerIds.has(row.user_id) && new Date(row.created_at).getTime() >= todayStart.getTime())
      .map((row) => row.user_id)
  );

  const filteredProgress = progressRows.filter((row) => learnerIds.has(row.user_id));
  const filteredAttempts = attemptRows.filter((row) => learnerIds.has(row.user_id));
  const lessonStats = buildLessonStats(filteredProgress, filteredAttempts, learnerRows.length);
  const studentsList = learnerRows
    .map((profile) =>
      buildStudentSummary(profile, progressRows, attemptRows, usageRows, streakRows, unlockRows)
    )
    .sort((a, b) => {
      const bLast = b.lastSeenAt ? new Date(b.lastSeenAt).getTime() : 0;
      const aLast = a.lastSeenAt ? new Date(a.lastSeenAt).getTime() : 0;
      return bLast - aLast || b.completedLessons - a.completedLessons;
    });

  const weakLessons = lessonStats
    .filter((lesson) => lesson.weakLearners > 0)
    .sort((a, b) => b.weakLearners - a.weakLearners || a.averageBestScore - b.averageBestScore)
    .slice(0, 8);

  const averageScore =
    filteredAttempts.length > 0
      ? filteredAttempts.reduce((sum, row) => sum + Number(row.score ?? 0), 0) / filteredAttempts.length
      : 0;

  return {
    students: learnerRows.length,
    quizAttempts: filteredAttempts.length,
    lessonsStarted: filteredProgress.length,
    averageScore,
    activeUsersToday: activeUsersToday.size,
    activeUsers7d: activeUsers.size,
    usageEvents: usageRows.length,
    averageCompletionRate:
      studentsList.length > 0
        ? studentsList.reduce((sum, student) => sum + student.completedLessons / allLessons.length, 0) /
          studentsList.length
        : 0,
    averageMasteryRate:
      studentsList.length > 0
        ? studentsList.reduce((sum, student) => sum + student.masteredLessons / allLessons.length, 0) /
          studentsList.length
        : 0,
    studentsList,
    lessonStats,
    weakLessons: weakLessons.map((lesson) => ({
      lessonId: lesson.lessonId,
      title: lesson.title,
      learners: lesson.weakLearners,
      averageBestScore: lesson.averageBestScore,
    })),
  };
}

function buildStudentSummary(
  profile: CloudProfileAdminRow,
  progressRows: CloudProgressAdminRow[],
  attemptRows: CloudQuizAttemptAdminRow[],
  usageRows: CloudUsageEventAdminRow[],
  streakRows: CloudStreakAdminRow[],
  unlockRows: CloudLessonUnlockAdminRow[]
): CloudAdminStudentSummary {
  const progress = progressRows.filter((row) => row.user_id === profile.user_id);
  const attempts = attemptRows
    .filter((row) => row.user_id === profile.user_id)
    .sort((a, b) => b.attempted_at - a.attempted_at);
  const usage = usageRows.filter((row) => row.user_id === profile.user_id);
  const streak = streakRows.filter((row) => row.user_id === profile.user_id);
  const unlocks = unlockRows.filter((row) => row.user_id === profile.user_id);
  const completedLessons = progress.filter((row) => isClearedMastery(row.mastery)).length;
  const masteredLessons = progress.filter((row) => row.mastery === 'mastered').length;
  const lastSeenAt = latestIso([
    profile.updated_at,
    ...usage.map((row) => row.created_at),
    ...progress.map((row) => row.updated_at),
  ]);
  const lastSyncAt = latestIso(
    usage.filter((row) => row.event_type === 'sync_completed').map((row) => row.created_at)
  );
  const connection = connectionFromLastSeen(lastSeenAt);
  const lessonProgress = progress
    .map((row) => {
      const lesson = allLessons.find((item) => item.id === row.lesson_id);
      return {
        lessonId: row.lesson_id,
        title: lesson?.title ?? row.lesson_id,
        trackId: (lesson?.trackId ?? row.track_id) as TrackId,
        order: lesson?.order ?? 999,
        mastery: row.mastery,
        attempts: row.attempts,
        bestScore: Number(row.best_score ?? 0),
        lastScore: Number(row.last_score ?? 0),
        stars: row.stars,
        completedAt: row.completed_at,
        lastAttemptAt: row.last_attempt_at,
      };
    })
    .sort((a, b) => trackOrder(a.trackId) - trackOrder(b.trackId) || a.order - b.order);
  const averageBestScore =
    progress.length > 0
      ? progress.reduce((sum, row) => sum + Number(row.best_score ?? 0), 0) / progress.length
      : 0;
  const averageQuizScore =
    attempts.length > 0
      ? attempts.reduce((sum, row) => sum + Number(row.score ?? 0), 0) / attempts.length
      : 0;

  return {
    userId: profile.user_id,
    displayName: profile.display_name || 'NeuroMath Explorer',
    role: profile.role,
    level: profile.level,
    xpTotal: profile.xp_total,
    coinsTotal: profile.coins_total,
    chestsOpened: profile.chests_opened,
    lessonsStarted: progress.length,
    completedLessons,
    masteredLessons,
    unlockedLessons: unlocks.length,
    quizAttempts: attempts.length,
    averageBestScore,
    averageQuizScore,
    activeDays: streak.filter((row) => row.lessons_completed > 0).length,
    lastSeenAt,
    lastSyncAt,
    connectionStatus: connection.status,
    connectionLabel: connection.label,
    trackProgress: tracks.map((track) => buildTrackProgress(track.id, progress)),
    weakLessons: lessonProgress
      .filter((row) => row.mastery === 'beginner' || row.mastery === 'practicing')
      .sort((a, b) => a.bestScore - b.bestScore)
      .slice(0, 8),
    lessonProgress,
    recentAttempts: attempts.slice(0, 8).map((row) => {
      const lesson = allLessons.find((item) => item.id === row.lesson_id);
      return {
        lessonId: row.lesson_id,
        title: lesson?.title ?? row.lesson_id,
        score: Number(row.score ?? 0),
        correct: row.correct,
        total: row.total,
        attemptedAt: row.attempted_at,
      };
    }),
  };
}

function buildTrackProgress(trackId: TrackId, progressRows: CloudProgressAdminRow[]): CloudAdminTrackProgress {
  const lessons = getTrackLessons(trackId);
  const lessonIds = new Set(lessons.map((lesson) => lesson.id));
  const rows = progressRows.filter((row) => lessonIds.has(row.lesson_id));
  return {
    trackId,
    title: tracks.find((track) => track.id === trackId)?.title ?? trackId,
    started: rows.length,
    completed: rows.filter((row) => isClearedMastery(row.mastery)).length,
    mastered: rows.filter((row) => row.mastery === 'mastered').length,
    total: lessons.length,
    averageBestScore:
      rows.length > 0 ? rows.reduce((sum, row) => sum + Number(row.best_score ?? 0), 0) / rows.length : 0,
  };
}

function buildLessonStats(
  progressRows: CloudProgressAdminRow[],
  attemptRows: CloudQuizAttemptAdminRow[],
  studentCount: number
): CloudAdminLessonStats[] {
  return allLessons
    .map((lesson) => {
      const progress = progressRows.filter((row) => row.lesson_id === lesson.id);
      const attempts = attemptRows.filter((row) => row.lesson_id === lesson.id);
      const completed = progress.filter((row) => isClearedMastery(row.mastery)).length;
      const mastered = progress.filter((row) => row.mastery === 'mastered').length;
      const weak = progress.filter((row) => row.mastery === 'beginner' || row.mastery === 'practicing').length;
      const averageBestScore =
        progress.length > 0
          ? progress.reduce((sum, row) => sum + Number(row.best_score ?? 0), 0) / progress.length
          : 0;
      const averageAttemptScore =
        attempts.length > 0
          ? attempts.reduce((sum, row) => sum + Number(row.score ?? 0), 0) / attempts.length
          : 0;
      return {
        lessonId: lesson.id,
        title: lesson.title,
        trackId: lesson.trackId,
        order: lesson.order,
        startedLearners: progress.length,
        completedLearners: completed,
        masteredLearners: mastered,
        weakLearners: weak,
        quizAttempts: attempts.length,
        averageBestScore,
        averageAttemptScore,
        completionRate: studentCount > 0 ? completed / studentCount : 0,
        masteryRate: studentCount > 0 ? mastered / studentCount : 0,
        weakRate: studentCount > 0 ? weak / studentCount : 0,
        lastAttemptAt: latestNumber(attempts.map((row) => row.attempted_at)),
      };
    })
    .sort((a, b) => trackOrder(a.trackId) - trackOrder(b.trackId) || a.order - b.order);
}

function isClearedMastery(mastery: string): boolean {
  return mastery === 'practicing' || mastery === 'strong' || mastery === 'mastered';
}

function latestIso(values: Array<string | null | undefined>): string | null {
  const latest = values
    .map((value) => (value ? new Date(value).getTime() : 0))
    .filter((value) => Number.isFinite(value) && value > 0)
    .sort((a, b) => b - a)[0];
  return latest ? new Date(latest).toISOString() : null;
}

function latestNumber(values: Array<number | null | undefined>): number | null {
  const latest = values
    .map((value) => value ?? 0)
    .filter((value) => Number.isFinite(value) && value > 0)
    .sort((a, b) => b - a)[0];
  return latest || null;
}

function connectionFromLastSeen(lastSeenAt: string | null): {
  status: CloudAdminStudentSummary['connectionStatus'];
  label: string;
} {
  if (!lastSeenAt) return { status: 'unknown', label: 'No cloud activity yet' };
  const lastSeenMs = new Date(lastSeenAt).getTime();
  const now = Date.now();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (lastSeenMs >= today.getTime()) return { status: 'active_today', label: 'Active today' };
  if (now - lastSeenMs <= 7 * 24 * 60 * 60 * 1000) return { status: 'active_7d', label: 'Active this week' };
  return { status: 'inactive', label: 'Inactive' };
}

function trackOrder(trackId: TrackId): number {
  return tracks.findIndex((track) => track.id === trackId);
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
