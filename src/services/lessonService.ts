/**
 * High-level orchestration: completing a lesson attempt.
 *
 * Ties together progress, mastery, rewards, streak, review state, and quests.
 * Screens call `completeLessonAttempt` and get a single summary object back.
 */

import { Lesson } from '../content/types';
import { progressRepository, LessonProgressRow } from '../repositories/progressRepository';
import { rewardsRepository } from '../repositories/rewardsRepository';
import { streakRepository } from '../repositories/streakRepository';
import { reviewRepository } from '../repositories/reviewRepository';
import { questsRepository } from '../repositories/questsRepository';
import { applyAttempt, MasteryLevel } from './masteryService';
import { computeReward, levelForXp, RewardResult } from './rewardService';
import { questsForDay, questProgressDelta, QuestId } from './questService';
import { isoDay } from '../utils/date';
import { achievements } from '../content/achievements';

export interface LessonAttemptInput {
  lesson: Lesson;
  correct: number;
  total: number;
  missedQuestionIds: string[];
}

export interface LessonAttemptResult {
  score: number;
  reward: RewardResult;
  masteryBefore: MasteryLevel;
  masteryAfter: MasteryLevel;
  stars: 0 | 1 | 2 | 3;
  level: number;
  xpIntoLevel: number;
  xpForNext: number;
  newAchievements: string[];
}

export function completeLessonAttempt(input: LessonAttemptInput): LessonAttemptResult {
  const { lesson, correct, total, missedQuestionIds } = input;
  const score = total > 0 ? correct / total : 0;
  const now = Date.now();

  // Load previous progress.
  const prev = progressRepository.getByLesson(lesson.id);
  const prevMastery: MasteryLevel = (prev?.mastery as MasteryLevel) ?? 'not_started';
  const prevBest = prev?.best_score ?? 0;
  const prevAttempts = prev?.attempts ?? 0;
  const prevSuccessful = estimateSuccessfulAttempts(prevAttempts, prevBest, lesson.masteryThreshold);

  const update = applyAttempt(
    {
      attempts: prevAttempts,
      bestScore: prevBest,
      lastScore: prev?.last_score ?? 0,
      successfulAttempts: prevSuccessful,
    },
    score,
    lesson.masteryThreshold
  );

  // Count completed lessons BEFORE writing this one so reward math is stable.
  const completedBefore = progressRepository
    .getAll()
    .filter((r) => (r.mastery as MasteryLevel) !== 'not_started').length;

  const reward = computeReward({
    lesson,
    score,
    alreadyMastered: prevMastery === 'mastered',
    newlyMastered: prevMastery !== 'mastered' && update.mastery === 'mastered',
    completedLessonsCount: completedBefore,
  });

  // Write progress.
  const row: LessonProgressRow = {
    lesson_id: lesson.id,
    track_id: lesson.trackId,
    attempts: update.attempts,
    best_score: update.bestScore,
    last_score: update.lastScore,
    stars: update.stars,
    mastery: update.mastery,
    last_attempt_at: now,
    completed_at: score >= lesson.masteryThreshold ? now : prev?.completed_at ?? null,
  };
  progressRepository.upsert(row);
  progressRepository.recordAttempt({
    lessonId: lesson.id,
    correct,
    total,
    score,
    xpAwarded: reward.xp,
    coinsAwarded: reward.coins,
    timestamp: now,
  });

  // Wallet updates.
  rewardsRepository.addXp(reward.xp);
  rewardsRepository.addCoins(reward.coins);
  if (reward.chestUnlocked) rewardsRepository.openChest();

  // Streak log.
  const counted = score >= lesson.masteryThreshold ? 1 : 0;
  streakRepository.recordActivity(counted, reward.xp);

  // Review state: any missed question drops a miss on this lesson; a full win
  // updates the last-reviewed timestamp.
  const rs = reviewRepository.all().find((r) => r.lesson_id === lesson.id);
  reviewRepository.upsert({
    lesson_id: lesson.id,
    last_reviewed_at: score >= 0.8 ? now : rs?.last_reviewed_at ?? null,
    last_missed_at: missedQuestionIds.length > 0 ? now : rs?.last_missed_at ?? null,
    priority: 0,
  });

  // Daily quests.
  applyDailyQuestProgress({
    lessonsCompleted: counted,
    xpEarned: reward.xp,
    masteryEvents: prevMastery !== 'mastered' && update.mastery === 'mastered' ? 1 : 0,
    reviewSessions: 0,
    neuroLessonsCompleted: lesson.trackId === 'neuroscience' && counted ? 1 : 0,
    mathLessonsCompleted: lesson.trackId === 'math' && counted ? 1 : 0,
  });

  // Level recomputation.
  const wallet = rewardsRepository.get();
  const { level, xpIntoLevel, xpForNext } = levelForXp(wallet.xpTotal);
  if (level !== wallet.level) rewardsRepository.setLevel(level);

  // Achievements.
  const newAchievements = checkAchievements();

  return {
    score,
    reward,
    masteryBefore: prevMastery,
    masteryAfter: update.mastery,
    stars: update.stars,
    level,
    xpIntoLevel,
    xpForNext,
    newAchievements,
  };
}

function estimateSuccessfulAttempts(attempts: number, bestScore: number, threshold: number): number {
  // We do not track per-attempt success in storage for compactness, so we
  // approximate: if best score met the threshold, assume at least two
  // successful attempts once attempts >= 2. Otherwise none.
  if (bestScore < threshold) return 0;
  return Math.min(attempts, 2);
}

function applyDailyQuestProgress(evt: {
  lessonsCompleted: number;
  xpEarned: number;
  masteryEvents: number;
  reviewSessions: number;
  neuroLessonsCompleted: number;
  mathLessonsCompleted: number;
}) {
  const day = isoDay();
  const quests = questsForDay(day);
  questsRepository.seed(
    day,
    quests.map((q) => ({ id: q.id, target: q.target }))
  );
  for (const q of quests) {
    const delta = questProgressDelta(q.id as QuestId, evt);
    if (delta > 0) questsRepository.addProgress(q.id, day, delta);
  }
}

function checkAchievements(): string[] {
  const newly: string[] = [];
  const progress = progressRepository.getAll();
  const wallet = rewardsRepository.get();
  const completed = progress.filter((p) => (p.mastery as MasteryLevel) !== 'not_started').length;
  const mastered = progress.filter((p) => p.mastery === 'mastered').length;

  for (const ach of achievements) {
    if (rewardsRepository.isAchievementUnlocked(ach.id)) continue;
    let unlocked = false;

    switch (ach.id) {
      case 'ach_first_lesson':
      case 'ach_five_lessons':
      case 'ach_ten_lessons':
      case 'ach_twenty':
      case 'ach_forty':
      case 'ach_seventy':
        unlocked = completed >= ach.target;
        break;
      case 'ach_xp_100':
      case 'ach_xp_500':
      case 'ach_xp_1500':
        unlocked = wallet.xpTotal >= ach.target;
        break;
      case 'ach_mastery_5':
      case 'ach_mastery_15':
        unlocked = mastered >= ach.target;
        break;
      case 'ach_brain_basics':
        unlocked =
          progress.filter((p) => p.track_id === 'neuroscience' && p.mastery !== 'not_started')
            .length >= ach.target;
        break;
      case 'ach_math_basics':
        unlocked =
          progress.filter((p) => p.track_id === 'math' && p.mastery !== 'not_started').length >=
          ach.target;
        break;
      case 'ach_compneuro':
        unlocked =
          progress.filter((p) => p.track_id === 'compneuro' && p.mastery !== 'not_started')
            .length >= ach.target;
        break;
      case 'ach_aibasis':
        unlocked =
          progress.filter((p) => p.track_id === 'aibasis' && p.mastery !== 'not_started')
            .length >= ach.target;
        break;
      case 'ach_aineuro':
        unlocked =
          progress.filter((p) => p.track_id === 'aineuro' && p.mastery !== 'not_started')
            .length >= ach.target;
        break;
      case 'ach_chest_first':
      case 'ach_chest_ten':
        unlocked = wallet.chestsOpened >= ach.target;
        break;
    }

    if (unlocked) {
      rewardsRepository.unlockAchievement(ach.id, Date.now());
      newly.push(ach.id);
    }
  }
  return newly;
}
