import {
  isLessonUnlocked,
  isLessonCleared,
  lessonState,
  nextRecommendedLesson,
  LessonProgressSummary,
} from '../src/services/unlockService';
import { allLessons, getLesson, getTrackLessons } from '../src/content/tracks';

function makeProgress(id: string, mastery: string, bestScore = 0.9): LessonProgressSummary {
  return { lessonId: id, mastery, bestScore };
}

describe('unlockService', () => {
  describe('Track A unlocking', () => {
    it('all Track A lessons are unlocked with empty progress', () => {
      const map = new Map<string, LessonProgressSummary>();
      const trackA = getTrackLessons('neuroscience');
      for (const l of trackA) {
        expect(isLessonUnlocked(l, map)).toBe(true);
      }
    });
  });

  describe('Track B unlocking', () => {
    it('B01 is unlocked with no progress (no prereqs)', () => {
      const map = new Map<string, LessonProgressSummary>();
      const b01 = getLesson('B01')!;
      expect(isLessonUnlocked(b01, map)).toBe(true);
    });

    it('B02 is locked when B01 is not cleared', () => {
      const map = new Map<string, LessonProgressSummary>();
      const b02 = getLesson('B02')!;
      expect(isLessonUnlocked(b02, map)).toBe(false);
    });

    it('B02 is unlocked when B01 is practicing', () => {
      const map = new Map<string, LessonProgressSummary>([
        ['B01', makeProgress('B01', 'practicing')],
      ]);
      const b02 = getLesson('B02')!;
      expect(isLessonUnlocked(b02, map)).toBe(true);
    });
  });

  describe('Track C unlocking', () => {
    it('C01 is locked without math foothold', () => {
      const map = new Map<string, LessonProgressSummary>();
      const c01 = getLesson('C01')!;
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
      expect(isLessonUnlocked(c01, map)).toBe(true);
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
  });
});
