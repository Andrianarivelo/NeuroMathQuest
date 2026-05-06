import { achievements } from '../src/content/achievements';
import { nextAchievementProgress } from '../src/services/achievementProgressService';

describe('achievementProgressService', () => {
  it('selects the closest locked achievement', () => {
    const next = nextAchievementProgress(achievements, [], {
      completedLessons: 4,
      masteredLessons: 0,
      currentStreak: 0,
      xpTotal: 20,
      chestsOpened: 0,
      completedByTrack: {},
    });

    expect(next?.achievement.id).toBe('ach_five_lessons');
    expect(next?.current).toBe(4);
    expect(next?.target).toBe(5);
  });

  it('ignores achievements that are already unlocked', () => {
    const next = nextAchievementProgress(achievements, ['ach_five_lessons'], {
      completedLessons: 4,
      masteredLessons: 0,
      currentStreak: 0,
      xpTotal: 90,
      chestsOpened: 0,
      completedByTrack: {},
    });

    expect(next?.achievement.id).toBe('ach_xp_100');
  });
});
