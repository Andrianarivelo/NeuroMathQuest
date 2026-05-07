import { initDb, resetDb } from '../src/db/db';
import { getLesson } from '../src/content/tracks';
import { lessonUnlocksRepository } from '../src/repositories/lessonUnlocksRepository';
import { rewardsRepository } from '../src/repositories/rewardsRepository';
import { purchaseLessonUnlock } from '../src/services/purchaseService';
import { LessonProgressSummary } from '../src/services/unlockService';

function makeProgress(id: string, mastery: string, bestScore = 0.9): LessonProgressSummary {
  return { lessonId: id, mastery, bestScore };
}

describe('purchaseService', () => {
  beforeEach(() => {
    initDb();
    resetDb();
  });

  it('spends coins and records a purchased lesson unlock', () => {
    const a06 = getLesson('A06')!;
    const progress = new Map<string, LessonProgressSummary>([
      ['A05', makeProgress('A05', 'practicing')],
    ]);

    rewardsRepository.addCoins(20);
    const result = purchaseLessonUnlock(a06, progress, new Set());

    expect(result.ok).toBe(true);
    expect(rewardsRepository.get().coinsTotal).toBe(20 - result.cost);
    expect(lessonUnlocksRepository.isPurchased('A06')).toBe(true);
  });

  it('does not spend coins before the learning gate is ready', () => {
    const a06 = getLesson('A06')!;
    rewardsRepository.addCoins(20);

    const result = purchaseLessonUnlock(a06, new Map(), new Set());

    expect(result.ok).toBe(false);
    expect(rewardsRepository.get().coinsTotal).toBe(20);
    expect(lessonUnlocksRepository.isPurchased('A06')).toBe(false);
  });

  it('does not record a purchase when coins are missing', () => {
    const b01 = getLesson('B01')!;
    rewardsRepository.addCoins(1);

    const result = purchaseLessonUnlock(b01, new Map(), new Set());

    expect(result.ok).toBe(false);
    expect(rewardsRepository.get().coinsTotal).toBe(1);
    expect(lessonUnlocksRepository.isPurchased('B01')).toBe(false);
  });
});
