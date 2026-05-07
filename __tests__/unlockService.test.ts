import {
  isLessonUnlocked,
  isLessonCleared,
  isLearningGateSatisfied,
  lessonAccess,
  lessonUnlockCost,
  lessonState,
  nextRecommendedLesson,
  LessonProgressSummary,
} from '../src/services/unlockService';
import { getLesson, getTrackLessons } from '../src/content/tracks';

function makeProgress(id: string, mastery: string, bestScore = 0.9): LessonProgressSummary {
  return { lessonId: id, mastery, bestScore };
}

describe('unlockService', () => {
  describe('Track A unlocking', () => {
    it('keeps only the first five neuroscience lessons free with empty progress', () => {
      const map = new Map<string, LessonProgressSummary>();
      const trackA = getTrackLessons('neuroscience');
      expect(trackA.slice(0, 5).every((l) => isLessonUnlocked(l, map))).toBe(true);
      expect(isLessonUnlocked(getLesson('A06')!, map)).toBe(false);
      expect(lessonUnlockCost(getLesson('A01')!)).toBe(0);
      expect(lessonUnlockCost(getLesson('A06')!)).toBeGreaterThan(0);
    });

    it('lets A06 become buyable after A05 is cleared', () => {
      const map = new Map<string, LessonProgressSummary>([
        ['A05', makeProgress('A05', 'practicing')],
      ]);
      const a06 = getLesson('A06')!;
      const access = lessonAccess(a06, map, new Set(), 99);
      expect(access.isUnlocked).toBe(false);
      expect(access.gateSatisfied).toBe(true);
      expect(access.canPurchase).toBe(true);
    });
  });

  describe('Track B unlocking', () => {
    it('B01 is buyable but not free with no progress', () => {
      const map = new Map<string, LessonProgressSummary>();
      const b01 = getLesson('B01')!;
      expect(isLessonUnlocked(b01, map)).toBe(false);
      expect(isLearningGateSatisfied(b01, map)).toBe(true);
      expect(lessonAccess(b01, map, new Set(), 99).canPurchase).toBe(true);
    });

    it('B02 is locked when B01 is not cleared', () => {
      const map = new Map<string, LessonProgressSummary>();
      const b02 = getLesson('B02')!;
      expect(isLessonUnlocked(b02, map)).toBe(false);
    });

    it('B02 is buyable when B01 is practicing', () => {
      const map = new Map<string, LessonProgressSummary>([
        ['B01', makeProgress('B01', 'practicing')],
      ]);
      const b02 = getLesson('B02')!;
      expect(isLessonUnlocked(b02, map)).toBe(false);
      expect(lessonAccess(b02, map, new Set(), 99).canPurchase).toBe(true);
    });

    it('a purchased lesson is unlocked', () => {
      const map = new Map<string, LessonProgressSummary>();
      const b01 = getLesson('B01')!;
      expect(isLessonUnlocked(b01, map, new Set(['B01']))).toBe(true);
    });
  });

  describe('Track C unlocking', () => {
    it('C01 is locked without math foothold', () => {
      const map = new Map<string, LessonProgressSummary>();
      const c01 = getLesson('C01')!;
      expect(isLearningGateSatisfied(c01, map)).toBe(false);
      expect(isLessonUnlocked(c01, map)).toBe(false);
    });

    it('C01 requires B01-B03 cleared + its own prereqs met', () => {
      const map = new Map<string, LessonProgressSummary>([
        ['B01', makeProgress('B01', 'practicing')],
        ['B02', makeProgress('B02', 'practicing')],
        ['B03', makeProgress('B03', 'practicing')],
        // C01 prereq is B15
        ['B15', makeProgress('B15', 'practicing')],
      ]);
      const c01 = getLesson('C01')!;
      expect(isLessonUnlocked(c01, map)).toBe(false);
      expect(lessonAccess(c01, map, new Set(), 99).canPurchase).toBe(true);
    });
  });

  describe('lessonState', () => {
    it('returns locked for locked lessons', () => {
      const map = new Map<string, LessonProgressSummary>();
      const b02 = getLesson('B02')!;
      expect(lessonState(b02, map)).toBe('locked');
    });

    it('returns unlocked for available but not-started lessons', () => {
      const map = new Map<string, LessonProgressSummary>();
      const a01 = getLesson('A01')!;
      expect(lessonState(a01, map)).toBe('unlocked');
    });

    it('returns mastered when mastery is mastered', () => {
      const map = new Map<string, LessonProgressSummary>([
        ['A01', makeProgress('A01', 'mastered')],
      ]);
      const a01 = getLesson('A01')!;
      expect(lessonState(a01, map)).toBe('mastered');
    });
  });

  describe('nextRecommendedLesson', () => {
    it('returns the first lesson when nothing is done', () => {
      const map = new Map<string, LessonProgressSummary>();
      const next = nextRecommendedLesson(map);
      expect(next).toBeDefined();
      expect(next!.id).toBe('A01');
    });

    it('moves on after one cleared lesson instead of requiring mastery', () => {
      const map = new Map<string, LessonProgressSummary>([
        ['A01', makeProgress('A01', 'practicing')],
      ]);
      const next = nextRecommendedLesson(map);
      expect(next).toBeDefined();
      expect(next!.id).toBe('A02');
    });
  });
});
