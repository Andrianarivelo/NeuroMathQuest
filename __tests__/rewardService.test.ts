import { computeReward, levelForXp } from '../src/services/rewardService';

const fakeLesson: any = {
  xpReward: 20,
  coinReward: 8,
  masteryThreshold: 0.8,
};

describe('rewardService', () => {
  describe('computeReward', () => {
    it('awards scaled XP and coins on a normal pass', () => {
      const r = computeReward({
        lesson: fakeLesson,
        score: 0.67,
        alreadyMastered: false,
        newlyMastered: false,
        completedLessonsCount: 3,
      });
      expect(r.xp).toBeGreaterThan(0);
      expect(r.coins).toBeGreaterThan(0);
      expect(r.perfectBonus).toBe(false);
      expect(r.chestUnlocked).toBe(false);
    });

    it('gives a perfect bonus for score = 1.0', () => {
      const r = computeReward({
        lesson: fakeLesson,
        score: 1.0,
        alreadyMastered: false,
        newlyMastered: false,
        completedLessonsCount: 2,
      });
      expect(r.perfectBonus).toBe(true);
      expect(r.xp).toBeGreaterThan(20); // base + perfect
    });

    it('gives a mastery bonus for newly mastered', () => {
      const r = computeReward({
        lesson: fakeLesson,
        score: 1.0,
        alreadyMastered: false,
        newlyMastered: true,
        completedLessonsCount: 2,
      });
      expect(r.masteryBonus).toBe(true);
      expect(r.xp).toBeGreaterThan(30); // base + perfect + mastery
    });

    it('unlocks a chest every 5 completed lessons', () => {
      const r = computeReward({
        lesson: fakeLesson,
        score: 1.0,
        alreadyMastered: false,
        newlyMastered: false,
        completedLessonsCount: 4, // 4 + 1 = 5 -> chest
      });
      expect(r.chestUnlocked).toBe(true);
    });

    it('does not penalise wrong answers too harshly (min 40% XP)', () => {
      const r = computeReward({
        lesson: fakeLesson,
        score: 0.0,
        alreadyMastered: false,
        newlyMastered: false,
        completedLessonsCount: 0,
      });
      expect(r.xp).toBeGreaterThanOrEqual(Math.round(20 * 0.4));
    });
  });

  describe('levelForXp', () => {
    it('starts at level 1 with 0 XP', () => {
      const { level } = levelForXp(0);
      expect(level).toBe(1);
    });

    it('advances past level 1 after enough XP', () => {
      const { level } = levelForXp(100);
      expect(level).toBeGreaterThanOrEqual(2);
    });

    it('returns xpIntoLevel less than xpForNext', () => {
      const { xpIntoLevel, xpForNext } = levelForXp(200);
      expect(xpIntoLevel).toBeLessThan(xpForNext);
    });
  });
});
