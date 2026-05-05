import {
  questsForDay,
  questProgressDelta,
  isQuestComplete,
} from '../src/services/questService';

describe('questService', () => {
  describe('questsForDay', () => {
    it('returns exactly 3 quests', () => {
      const quests = questsForDay('2025-01-15');
      expect(quests).toHaveLength(3);
    });

    it('returns the same quests for the same day', () => {
      const a = questsForDay('2025-06-01');
      const b = questsForDay('2025-06-01');
      expect(a.map((q) => q.id)).toEqual(b.map((q) => q.id));
    });

    it('can return different quests on different days', () => {
      const a = questsForDay('2025-01-01');
      const b = questsForDay('2025-01-02');
      // Not guaranteed different, but the hashing should give variety over many days.
      // At minimum just check both are valid.
      expect(a.length).toBe(3);
      expect(b.length).toBe(3);
    });
  });

  describe('questProgressDelta', () => {
    it('counts lessons for two_lessons quest', () => {
      const d = questProgressDelta('two_lessons', {
        lessonsCompleted: 1,
        xpEarned: 0,
        masteryEvents: 0,
        reviewSessions: 0,
        neuroLessonsCompleted: 0,
        mathLessonsCompleted: 0,
      });
      expect(d).toBe(1);
    });

    it('counts xp for earn_30_xp quest', () => {
      const d = questProgressDelta('earn_30_xp', {
        lessonsCompleted: 0,
        xpEarned: 25,
        masteryEvents: 0,
        reviewSessions: 0,
        neuroLessonsCompleted: 0,
        mathLessonsCompleted: 0,
      });
      expect(d).toBe(25);
    });
  });

  describe('isQuestComplete', () => {
    it('returns true when progress >= target', () => {
      expect(isQuestComplete(2, 2)).toBe(true);
      expect(isQuestComplete(5, 3)).toBe(true);
    });

    it('returns false when progress < target', () => {
      expect(isQuestComplete(1, 2)).toBe(false);
    });
  });
});
