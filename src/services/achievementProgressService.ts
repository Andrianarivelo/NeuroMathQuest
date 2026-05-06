import { Achievement } from '../content/achievements';
import { TrackId } from '../content/types';

export interface AchievementMetrics {
  completedLessons: number;
  masteredLessons: number;
  currentStreak: number;
  xpTotal: number;
  chestsOpened: number;
  completedByTrack: Partial<Record<TrackId, number>>;
}

export interface AchievementProgress {
  achievement: Achievement;
  current: number;
  target: number;
  ratio: number;
}

export function achievementCurrentValue(
  achievementId: string,
  metrics: AchievementMetrics
): number {
  switch (achievementId) {
    case 'ach_first_lesson':
    case 'ach_five_lessons':
    case 'ach_ten_lessons':
    case 'ach_twenty':
    case 'ach_forty':
    case 'ach_seventy':
      return metrics.completedLessons;
    case 'ach_streak_3':
    case 'ach_streak_7':
    case 'ach_streak_30':
      return metrics.currentStreak;
    case 'ach_xp_100':
    case 'ach_xp_500':
    case 'ach_xp_1500':
      return metrics.xpTotal;
    case 'ach_mastery_5':
    case 'ach_mastery_15':
      return metrics.masteredLessons;
    case 'ach_brain_basics':
      return metrics.completedByTrack.neuroscience ?? 0;
    case 'ach_math_basics':
      return metrics.completedByTrack.math ?? 0;
    case 'ach_compneuro':
      return metrics.completedByTrack.compneuro ?? 0;
    case 'ach_aibasis':
      return metrics.completedByTrack.aibasis ?? 0;
    case 'ach_aineuro':
      return metrics.completedByTrack.aineuro ?? 0;
    case 'ach_chest_first':
    case 'ach_chest_ten':
      return metrics.chestsOpened;
    default:
      return 0;
  }
}

export function nextAchievementProgress(
  achievements: Achievement[],
  unlockedAchievementIds: string[],
  metrics: AchievementMetrics
): AchievementProgress | null {
  const unlocked = new Set(unlockedAchievementIds);
  const locked = achievements
    .filter((achievement) => !unlocked.has(achievement.id))
    .map((achievement) => {
      const current = achievementCurrentValue(achievement.id, metrics);
      return {
        achievement,
        current,
        target: achievement.target,
        ratio: Math.min(1, current / Math.max(1, achievement.target)),
      };
    })
    .filter((progress) => progress.current < progress.target);

  if (locked.length === 0) return null;

  return locked.sort((a, b) => {
    if (b.ratio !== a.ratio) return b.ratio - a.ratio;
    return a.target - b.target;
  })[0];
}
