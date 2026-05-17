import {
  computeMastery,
  starsForMastery,
  applyAttempt,
  MasteryLevel,
} from '../src/services/masteryService';

describe('masteryService', () => {
  describe('computeMastery', () => {
    it('returns not_started for zero attempts', () => {
      expect(computeMastery({ attempts: 0, bestScore: 0, lastScore: 0, successfulAttempts: 0 })).toBe('not_started');
    });

    it('returns beginner when best score is below 0.6', () => {
      expect(computeMastery({ attempts: 2, bestScore: 0.5, lastScore: 0.5, successfulAttempts: 0 })).toBe('beginner');
    });

    it('returns practicing when best score is 0.6-0.79', () => {
      expect(computeMastery({ attempts: 3, bestScore: 0.7, lastScore: 0.7, successfulAttempts: 0 })).toBe('practicing');
    });

    it('returns strong with score >= 0.8 after one successful attempt', () => {
      expect(computeMastery({ attempts: 1, bestScore: 0.85, lastScore: 0.85, successfulAttempts: 1 })).toBe('strong');
    });

    it('returns mastered with a perfect first attempt', () => {
      expect(computeMastery({ attempts: 1, bestScore: 1.0, lastScore: 1.0, successfulAttempts: 1 })).toBe('mastered');
    });

    it('does not require repeated successful attempts for mastery', () => {
      expect(computeMastery({ attempts: 2, bestScore: 1.0, lastScore: 0.67, successfulAttempts: 1 })).toBe('mastered');
    });
  });

  describe('starsForMastery', () => {
    it('maps not_started -> 0', () => expect(starsForMastery('not_started')).toBe(0));
    it('maps beginner -> 0', () => expect(starsForMastery('beginner')).toBe(0));
    it('maps practicing -> 1', () => expect(starsForMastery('practicing')).toBe(1));
    it('maps strong -> 2', () => expect(starsForMastery('strong')).toBe(2));
    it('maps mastered -> 3', () => expect(starsForMastery('mastered')).toBe(3));
  });

  describe('applyAttempt', () => {
    it('increments attempts from null previous', () => {
      const result = applyAttempt(null, 0.67, 0.8);
      expect(result.attempts).toBe(1);
      expect(result.bestScore).toBe(0.67);
      expect(result.mastery).toBe('practicing');
      expect(result.stars).toBe(1);
    });

    it('gives 3 stars for a perfect first attempt', () => {
      const result = applyAttempt(null, 1.0, 0.8);
      expect(result.mastery).toBe('mastered');
      expect(result.stars).toBe(3);
    });

    it('keeps best score when new score is lower', () => {
      const prev = { attempts: 2, bestScore: 0.9, lastScore: 0.9, successfulAttempts: 2 };
      const result = applyAttempt(prev, 0.5, 0.8);
      expect(result.bestScore).toBe(0.9);
      expect(result.lastScore).toBe(0.5);
    });

    it('upgrades mastery with repeated success', () => {
      const prev = { attempts: 1, bestScore: 1.0, lastScore: 1.0, successfulAttempts: 1 };
      const result = applyAttempt(prev, 1.0, 0.8);
      expect(result.successfulAttempts).toBe(2);
      expect(result.mastery).toBe('mastered');
      expect(result.stars).toBe(3);
    });
  });
});
