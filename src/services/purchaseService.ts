import { Lesson } from '../content/types';
import { lessonUnlocksRepository } from '../repositories/lessonUnlocksRepository';
import { rewardsRepository } from '../repositories/rewardsRepository';
import { LessonProgressSummary, lessonAccess } from './unlockService';
import { syncLocalProgressToCloud } from './backend/syncService';

export type PurchaseLessonResult =
  | { ok: true; cost: number; coinsLeft: number; message: string }
  | { ok: false; cost: number; coinsLeft: number; message: string };

export function purchaseLessonUnlock(
  lesson: Lesson,
  progressByLesson: Map<string, LessonProgressSummary>,
  purchasedLessonIds: ReadonlySet<string>
): PurchaseLessonResult {
  const wallet = rewardsRepository.get();
  const access = lessonAccess(lesson, progressByLesson, purchasedLessonIds, wallet.coinsTotal);

  if (access.isUnlocked) {
    return {
      ok: true,
      cost: 0,
      coinsLeft: wallet.coinsTotal,
      message: 'This lesson is already unlocked.',
    };
  }

  if (!access.gateSatisfied) {
    return {
      ok: false,
      cost: access.cost,
      coinsLeft: wallet.coinsTotal,
      message: access.lockedReason,
    };
  }

  if (wallet.coinsTotal < access.cost) {
    return {
      ok: false,
      cost: access.cost,
      coinsLeft: wallet.coinsTotal,
      message: access.lockedReason,
    };
  }

  if (!rewardsRepository.spendCoins(access.cost)) {
    return {
      ok: false,
      cost: access.cost,
      coinsLeft: wallet.coinsTotal,
      message: 'Not enough coins yet. Finish another early lesson and come back.',
    };
  }

  lessonUnlocksRepository.add(lesson.id, access.cost, Date.now());
  const updatedWallet = rewardsRepository.get();
  void syncLocalProgressToCloud();

  return {
    ok: true,
    cost: access.cost,
    coinsLeft: updatedWallet.coinsTotal,
    message: `Unlocked for ${access.cost} coins. Nice choice.`,
  };
}
