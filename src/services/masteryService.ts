/**
 * Mastery service.
 *
 * Pure functions that derive mastery level and star rating from attempts and
 * scores. Kept separate from the repository so it can be unit-tested in
 * isolation (no SQLite needed).
 */

export type MasteryLevel = 'not_started' | 'beginner' | 'practicing' | 'strong' | 'mastered';

export interface MasteryInput {
  attempts: number;
  bestScore: number;
  lastScore: number;
  successfulAttempts: number; // number of attempts \u2265 masteryThreshold
}

export function computeMastery(input: MasteryInput): MasteryLevel {
  const { attempts, bestScore } = input;
  if (attempts === 0) return 'not_started';
  if (bestScore >= 0.95) return 'mastered';
  if (bestScore >= 0.8) return 'strong';
  if (bestScore >= 0.6) return 'practicing';
  return 'beginner';
}

/**
 * Star mapping used for UI display. Each level has a stable star count so the
 * progress bar never "loses" stars on a bad attempt.
 */
export function starsForMastery(level: MasteryLevel): 0 | 1 | 2 | 3 {
  switch (level) {
    case 'not_started':
    case 'beginner':
      return 0;
    case 'practicing':
      return 1;
    case 'strong':
      return 2;
    case 'mastered':
      return 3;
  }
}

/**
 * Update a running mastery record after a new attempt. Keeps the old best and
 * successful counters and advances them if the new attempt improved things.
 */
export interface MasteryUpdate {
  attempts: number;
  bestScore: number;
  lastScore: number;
  successfulAttempts: number;
  mastery: MasteryLevel;
  stars: 0 | 1 | 2 | 3;
}

export function applyAttempt(
  previous: MasteryInput | null,
  newScore: number,
  threshold: number
): MasteryUpdate {
  const attempts = (previous?.attempts ?? 0) + 1;
  const bestScore = Math.max(previous?.bestScore ?? 0, newScore);
  const lastScore = newScore;
  const successfulAttempts =
    (previous?.successfulAttempts ?? 0) + (newScore >= threshold ? 1 : 0);
  const mastery = computeMastery({ attempts, bestScore, lastScore, successfulAttempts });
  return {
    attempts,
    bestScore,
    lastScore,
    successfulAttempts,
    mastery,
    stars: starsForMastery(mastery),
  };
}
