/**
 * Unlocking rules.
 *
 * A small coin economy sits on top of the learning prerequisites:
 *
 * - The first five neuroscience lessons are free so a new learner can start
 *   and earn coins immediately.
 * - Later lessons must be purchased with earned coins, but only once their
 *   learning gate is ready. This prevents skipping too far ahead.
 * - Previously started lessons stay open, so existing learners are not locked
 *   out by a new app version.
 */

import { Lesson } from '../content/types';
import { allLessons, getTrackLessons } from '../content/tracks';

export interface LessonProgressSummary {
  lessonId: string;
  mastery: string; // 'not_started' | 'beginner' | 'practicing' | 'strong' | 'mastered'
  bestScore: number;
}

export type LessonState = 'locked' | 'unlocked' | 'in_progress' | 'completed' | 'mastered';

export interface LessonAccessSummary {
  isUnlocked: boolean;
  isFree: boolean;
  isPurchased: boolean;
  canPurchase: boolean;
  gateSatisfied: boolean;
  cost: number;
  missingCoins: number;
  lockedReason: string;
}

const OK_LEVELS = new Set(['practicing', 'strong', 'mastered']);
const FREE_NEUROSCIENCE_LESSONS = 5;

export function isLessonCleared(progress?: LessonProgressSummary): boolean {
  return !!progress && OK_LEVELS.has(progress.mastery);
}

function isLessonStarted(progress?: LessonProgressSummary): boolean {
  return !!progress && (progress.mastery !== 'not_started' || progress.bestScore > 0);
}

export function isFreeStarterLesson(lesson: Lesson): boolean {
  return lesson.trackId === 'neuroscience' && lesson.order <= FREE_NEUROSCIENCE_LESSONS;
}

function previousLesson(lesson: Lesson): Lesson | null {
  const lessons = getTrackLessons(lesson.trackId);
  const index = lessons.findIndex((item) => item.id === lesson.id);
  return index > 0 ? lessons[index - 1] : null;
}

export function isLearningGateSatisfied(
  lesson: Lesson,
  progressByLesson: Map<string, LessonProgressSummary>
): boolean {
  if (lesson.trackId === 'neuroscience') {
    if (isFreeStarterLesson(lesson)) return true;
    const prev = previousLesson(lesson);
    return prev ? isLessonCleared(progressByLesson.get(prev.id)) : true;
  }

  // Track B: linear unlock. Respect explicit prerequisites which are the
  // previous Bxx lesson by default.
  if (lesson.trackId === 'math') {
    if (lesson.prerequisites.length === 0) return true;
    return lesson.prerequisites.every((pid) => isLessonCleared(progressByLesson.get(pid)));
  }

  // Track C: require a basic foothold in Track B (first 3 math lessons
  // cleared) and satisfy lesson-specific prerequisites.
  if (lesson.trackId === 'compneuro') {
    const mathFoothold = ['B01', 'B02', 'B03'].every((pid) =>
      isLessonCleared(progressByLesson.get(pid))
    );
    if (!mathFoothold) return false;
    return lesson.prerequisites.every((pid) => isLessonCleared(progressByLesson.get(pid)));
  }

  // Track D (AI Basics): linear unlock via declared prerequisites, similar
  // to Track B.
  if (lesson.trackId === 'aibasis') {
    if (lesson.prerequisites.length === 0) return true;
    return lesson.prerequisites.every((pid) => isLessonCleared(progressByLesson.get(pid)));
  }

  // Track E (NeuroAI): require a foothold in AI Basics (first 3 lessons)
  // and a tiny bit of Neuroscience Basics, plus declared prerequisites.
  if (lesson.trackId === 'aineuro') {
    const aiFoothold = ['D01', 'D02', 'D03'].every((pid) =>
      isLessonCleared(progressByLesson.get(pid))
    );
    const neuroFoothold = ['A01', 'A02'].every((pid) =>
      isLessonCleared(progressByLesson.get(pid))
    );
    if (!aiFoothold || !neuroFoothold) return false;
    return lesson.prerequisites.every((pid) => isLessonCleared(progressByLesson.get(pid)));
  }

  return false;
}

export function lessonUnlockCost(lesson: Lesson): number {
  if (isFreeStarterLesson(lesson)) return 0;

  const baseCost = {
    neuroscience: 5,
    math: 8,
    compneuro: 12,
    aibasis: 10,
    aineuro: 12,
  }[lesson.trackId];
  const tier = Math.floor(Math.max(0, lesson.order - 1) / 10);
  return baseCost + tier * 2;
}

export function lessonAccess(
  lesson: Lesson,
  progressByLesson: Map<string, LessonProgressSummary>,
  purchasedLessonIds: ReadonlySet<string> = new Set<string>(),
  coinBalance = 0
): LessonAccessSummary {
  const progress = progressByLesson.get(lesson.id);
  const isFree = isFreeStarterLesson(lesson);
  const isPurchased = purchasedLessonIds.has(lesson.id);
  const gateSatisfied = isLearningGateSatisfied(lesson, progressByLesson);
  const cost = lessonUnlockCost(lesson);
  const isUnlocked = isFree || isPurchased || isLessonStarted(progress);
  const missingCoins = Math.max(0, cost - coinBalance);
  const canPurchase = !isUnlocked && cost > 0 && gateSatisfied;
  const lockedReason = !gateSatisfied
    ? 'Complete the previous required lesson first.'
    : missingCoins > 0
    ? `Earn ${missingCoins} more coin${missingCoins === 1 ? '' : 's'} to unlock this lesson.`
    : `Unlock this lesson for ${cost} coins.`;

  return {
    isUnlocked,
    isFree,
    isPurchased,
    canPurchase,
    gateSatisfied,
    cost,
    missingCoins,
    lockedReason,
  };
}

export function isLessonUnlocked(
  lesson: Lesson,
  progressByLesson: Map<string, LessonProgressSummary>,
  purchasedLessonIds: ReadonlySet<string> = new Set<string>()
): boolean {
  return lessonAccess(lesson, progressByLesson, purchasedLessonIds).isUnlocked;
}

export function lessonState(
  lesson: Lesson,
  progressByLesson: Map<string, LessonProgressSummary>,
  purchasedLessonIds: ReadonlySet<string> = new Set<string>()
): LessonState {
  const p = progressByLesson.get(lesson.id);
  if (!isLessonUnlocked(lesson, progressByLesson, purchasedLessonIds) && !p) return 'locked';
  if (!p || p.mastery === 'not_started') return 'unlocked';
  if (p.mastery === 'mastered') return 'mastered';
  if (OK_LEVELS.has(p.mastery)) return 'completed';
  return 'in_progress';
}

export function nextRecommendedLesson(
  progressByLesson: Map<string, LessonProgressSummary>,
  purchasedLessonIds: ReadonlySet<string> = new Set<string>()
): Lesson | null {
  // Recommend the first unlocked lesson that is not yet cleared. Mastery is
  // still valuable, but it should not block the learner from moving on after
  // one successful quiz attempt.
  const tracksOrder: Array<'math' | 'neuroscience' | 'compneuro' | 'aibasis' | 'aineuro'> = [
    'neuroscience',
    'math',
    'compneuro',
    'aibasis',
    'aineuro',
  ];
  for (const trackId of tracksOrder) {
    const lessons = getTrackLessons(trackId);
    for (const lesson of lessons) {
      if (!isLessonUnlocked(lesson, progressByLesson, purchasedLessonIds)) continue;
      const p = progressByLesson.get(lesson.id);
      if (!isLessonCleared(p)) return lesson;
    }
  }
  return null;
}

export function unlockedLessonIds(
  progressByLesson: Map<string, LessonProgressSummary>,
  purchasedLessonIds: ReadonlySet<string> = new Set<string>()
): string[] {
  return allLessons
    .filter((l) => isLessonUnlocked(l, progressByLesson, purchasedLessonIds))
    .map((l) => l.id);
}
