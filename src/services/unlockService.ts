/**
 * Unlocking rules.
 *
 * - Track A (neuroscience) is fully unlocked at first launch.
 * - Track B (math) unlocks linearly: lesson N unlocks when lesson N-1 is at
 *   least "practicing".
 * - Track C (compneuro) unlocks progressively using each lesson's declared
 *   prerequisites, and additionally requires that at least the first three
 *   math lessons are practicing before any Track C lesson becomes available.
 * - Track D (aibasis) unlocks linearly via prerequisites within the track.
 * - Track E (aineuro) unlocks progressively via lesson prerequisites and
 *   additionally requires a foothold in AI Basics (D01-D03) and in
 *   Neuroscience Basics (A01-A02).
 */

import { Lesson } from '../content/types';
import { allLessons, getTrackLessons } from '../content/tracks';

export interface LessonProgressSummary {
  lessonId: string;
  mastery: string; // 'not_started' | 'beginner' | 'practicing' | 'strong' | 'mastered'
  bestScore: number;
}

export type LessonState = 'locked' | 'unlocked' | 'in_progress' | 'completed' | 'mastered';

const OK_LEVELS = new Set(['practicing', 'strong', 'mastered']);

export function isLessonCleared(progress?: LessonProgressSummary): boolean {
  return !!progress && OK_LEVELS.has(progress.mastery);
}

export function isLessonUnlocked(
  lesson: Lesson,
  progressByLesson: Map<string, LessonProgressSummary>
): boolean {
  // Track A is always unlocked.
  if (lesson.trackId === 'neuroscience') return true;

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

export function lessonState(
  lesson: Lesson,
  progressByLesson: Map<string, LessonProgressSummary>
): LessonState {
  const p = progressByLesson.get(lesson.id);
  if (!isLessonUnlocked(lesson, progressByLesson) && !p) return 'locked';
  if (!p || p.mastery === 'not_started') return 'unlocked';
  if (p.mastery === 'mastered') return 'mastered';
  if (OK_LEVELS.has(p.mastery)) return 'completed';
  return 'in_progress';
}

export function nextRecommendedLesson(
  progressByLesson: Map<string, LessonProgressSummary>
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
      if (!isLessonUnlocked(lesson, progressByLesson)) continue;
      const p = progressByLesson.get(lesson.id);
      if (!isLessonCleared(p)) return lesson;
    }
  }
  return null;
}

export function unlockedLessonIds(
  progressByLesson: Map<string, LessonProgressSummary>
): string[] {
  return allLessons.filter((l) => isLessonUnlocked(l, progressByLesson)).map((l) => l.id);
}
