import { getDb } from '../db/db';
import { isoDay } from '../utils/date';

export interface StreakDay {
  day: string;
  lessonsCompleted: number;
  xpEarned: number;
}

interface StreakDayRow {
  day: string;
  lessons_completed: number;
  xp_earned: number;
}

export const streakRepository = {
  recordActivity(lessons: number, xp: number, now = new Date()): void {
    const day = isoDay(now);
    getDb().runSync(
      `INSERT INTO streak_log (day, lessons_completed, xp_earned) VALUES (?, ?, ?)
       ON CONFLICT(day) DO UPDATE SET
         lessons_completed = lessons_completed + excluded.lessons_completed,
         xp_earned = xp_earned + excluded.xp_earned;`,
      [day, lessons, xp]
    );
  },

  upsertDay(day: string, lessonsCompleted: number, xpEarned: number): void {
    getDb().runSync(
      `INSERT INTO streak_log (day, lessons_completed, xp_earned) VALUES (?, ?, ?)
       ON CONFLICT(day) DO UPDATE SET
         lessons_completed = MAX(lessons_completed, excluded.lessons_completed),
         xp_earned = MAX(xp_earned, excluded.xp_earned);`,
      [day, lessonsCompleted, xpEarned]
    );
  },

  recent(days: number): StreakDay[] {
    return getDb()
      .getAllSync<StreakDayRow>(
        'SELECT day, lessons_completed, xp_earned FROM streak_log ORDER BY day DESC LIMIT ?;',
        [days]
      )
      .map((r) => ({ day: r.day, lessonsCompleted: r.lessons_completed, xpEarned: r.xp_earned }));
  },

  forDay(day: string): StreakDay | null {
    const row = getDb().getFirstSync<StreakDayRow>(
      'SELECT day, lessons_completed, xp_earned FROM streak_log WHERE day = ?;',
      [day]
    );
    if (!row) return null;
    return { day: row.day, lessonsCompleted: row.lessons_completed, xpEarned: row.xp_earned };
  },
};
