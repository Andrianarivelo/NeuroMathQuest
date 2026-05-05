import {
  priorityScore,
  rankForReview,
  pickReviewSet,
  ReviewCandidate,
} from '../src/services/reviewService';

const NOW = Date.now();
const ONE_DAY = 24 * 60 * 60 * 1000;

describe('reviewService', () => {
  describe('priorityScore', () => {
    it('returns 0 for not_started lessons', () => {
      const c: ReviewCandidate = {
        lessonId: 'A01',
        mastery: 'not_started',
        lastReviewedAt: null,
        lastMissedAt: null,
        bestScore: 0,
      };
      expect(priorityScore(c, NOW)).toBe(0);
    });

    it('ranks beginners higher than mastered', () => {
      const beginner: ReviewCandidate = {
        lessonId: 'A02',
        mastery: 'beginner',
        lastReviewedAt: NOW - 5 * ONE_DAY,
        lastMissedAt: NOW - 2 * ONE_DAY,
        bestScore: 0.5,
      };
      const mastered: ReviewCandidate = {
        lessonId: 'A03',
        mastery: 'mastered',
        lastReviewedAt: NOW - 5 * ONE_DAY,
        lastMissedAt: null,
        bestScore: 1.0,
      };
      expect(priorityScore(beginner, NOW)).toBeGreaterThan(priorityScore(mastered, NOW));
    });

    it('boosts recently missed', () => {
      const missed: ReviewCandidate = {
        lessonId: 'A04',
        mastery: 'practicing',
        lastReviewedAt: NOW - 5 * ONE_DAY,
        lastMissedAt: NOW - 1 * ONE_DAY, // recently missed
        bestScore: 0.6,
      };
      const notMissed: ReviewCandidate = {
        ...missed,
        lastMissedAt: null,
      };
      expect(priorityScore(missed, NOW)).toBeGreaterThan(priorityScore(notMissed, NOW));
    });
  });

  describe('pickReviewSet', () => {
    it('returns at most the requested number', () => {
      const candidates: ReviewCandidate[] = Array.from({ length: 10 }).map((_, i) => ({
        lessonId: `A${String(i + 1).padStart(2, '0')}`,
        mastery: 'beginner',
        lastReviewedAt: NOW - 7 * ONE_DAY,
        lastMissedAt: null,
        bestScore: 0.4,
      }));
      const result = pickReviewSet(candidates, 5, NOW);
      expect(result.length).toBeLessThanOrEqual(5);
    });

    it('filters out not_started', () => {
      const candidates: ReviewCandidate[] = [
        { lessonId: 'A01', mastery: 'not_started', lastReviewedAt: null, lastMissedAt: null, bestScore: 0 },
        { lessonId: 'A02', mastery: 'beginner', lastReviewedAt: NOW - ONE_DAY, lastMissedAt: null, bestScore: 0.4 },
      ];
      const result = pickReviewSet(candidates, 5, NOW);
      expect(result.length).toBe(1);
      expect(result[0].lessonId).toBe('A02');
    });
  });
});
