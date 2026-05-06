/**
 * Reward service.
 *
 * Pure reward math + a thin orchestration layer that reads/writes repositories.
 * Core math functions live at the top so they can be unit-tested without a DB.
 */

import { Lesson } from '../content/types';

export interface RewardResult {
  xp: number;
  coins: number;
  chestUnlocked: boolean;
  perfectBonus: boolean;
  masteryBonus: boolean;
}

/**
 * Compute the XP + coins a user earns for a particular quiz attempt.
 * Perfect score adds a 50% bonus; reaching (or re-reaching) mastery adds a
 * flat bonus so mastery always feels meaningful.
 */
export function computeReward(params: {
  lesson: Lesson;
  score: number;
  alreadyMastered: boolean;
  newlyMastered: boolean;
  completedLessonsCount: number;
}): RewardResult {
  const { lesson, score, alreadyMastered, newlyMastered, completedLessonsCount } = params;

  // Scale base XP by score but never below 40% of base - wrong answers are not
  // punitive.
  const baseXp = lesson.xpReward;
  const scaledXp = Math.round(baseXp * Math.max(0.4, score));

  const perfect = score >= 0.999;
  const perfectBonus = perfect ? Math.round(baseXp * 0.5) : 0;
  const masteryBonus = newlyMastered && !alreadyMastered ? 20 : 0;

  const xp = scaledXp + perfectBonus + masteryBonus;

  // Coins: base + small perfect bonus.
  const baseCoins = lesson.coinReward;
  const scaledCoins = Math.round(baseCoins * Math.max(0.5, score));
  const coins = scaledCoins + (perfect ? 3 : 0) + (newlyMastered ? 5 : 0);

  // Chest unlocked every 5 completed lessons.
  const chestUnlocked =
    (completedLessonsCount + 1) % 5 === 0 && score >= lesson.masteryThreshold;

  return {
    xp,
    coins,
    chestUnlocked,
    perfectBonus: perfect,
    masteryBonus: newlyMastered,
  };
}

/**
 * Compute a learner's level from total XP. Each level has a growing XP
 * requirement: level k needs 50 * k^1.5 XP since the previous level.
 */
export function levelForXp(xpTotal: number): { level: number; xpIntoLevel: number; xpForNext: number } {
  let level = 1;
  let remaining = xpTotal;
  while (true) {
    const needed = Math.round(50 * Math.pow(level, 1.5));
    if (remaining < needed) {
      return { level, xpIntoLevel: remaining, xpForNext: needed };
    }
    remaining -= needed;
    level += 1;
    if (level > 999) return { level, xpIntoLevel: 0, xpForNext: 0 };
  }
}
