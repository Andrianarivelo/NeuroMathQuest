/**
 * Review prioritisation service.
 *
 * Ranks lessons by a "review need" score that combines:
 *  - Lower mastery \u2192 higher priority
 *  - Longer time since last review \u2192 higher priority
 *  - Recent misses \u2192 higher priority
 *  - Never-started lessons do not need review (they need learning)
 */

export interface ReviewCandidate {
  lessonId: string;
  mastery: 'not_started' | 'beginner' | 'practicing' | 'strong' | 'mastered';
  lastReviewedAt: number | null;
  lastMissedAt: number | null;
  bestScore: number;
}

const MASTERY_WEIGHT: Record<ReviewCandidate['mastery'], number> = {
  not_started: 0,
  beginner: 1.2,
  practicing: 1.0,
  strong: 0.5,
  mastered: 0.2,
};

export function priorityScore(
  candidate: ReviewCandidate,
  now: number = Date.now()
): number {
  // Never started: do not review, they should be learned fresh.
  if (candidate.mastery === 'not_started') return 0;

  const masteryFactor = MASTERY_WEIGHT[candidate.mastery];

  // Days since last review (larger \u2192 more urgent), capped at 30.
  const days = candidate.lastReviewedAt
    ? Math.min(30, (now - candidate.lastReviewedAt) / (1000 * 60 * 60 * 24))
    : 15;
  const stalenessFactor = 0.3 + days / 30; // in [0.3, 1.3]

  // Recent miss boost: anything missed in the last 3 days gets a +0.5 nudge.
  const recentMiss =
    candidate.lastMissedAt &&
    now - candidate.lastMissedAt < 3 * 24 * 60 * 60 * 1000
      ? 0.5
      : 0;

  // Score quality factor: lower best score \u2192 higher need.
  const qualityFactor = 1 + Math.max(0, 1 - candidate.bestScore) * 0.5;

  return masteryFactor * stalenessFactor * qualityFactor + recentMiss;
}

export function rankForReview(
  candidates: ReviewCandidate[],
  now: number = Date.now()
): ReviewCandidate[] {
  return [...candidates]
    .map((c) => ({ c, s: priorityScore(c, now) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .map((x) => x.c);
}

export function pickReviewSet(
  candidates: ReviewCandidate[],
  size: number,
  now: number = Date.now()
): ReviewCandidate[] {
  return rankForReview(candidates, now).slice(0, size);
}
