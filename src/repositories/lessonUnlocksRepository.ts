import { getDb } from '../db/db';

export interface LessonUnlockRow {
  lesson_id: string;
  cost_paid: number;
  unlocked_at: number;
}

export const lessonUnlocksRepository = {
  getAll(): LessonUnlockRow[] {
    return getDb().getAllSync<LessonUnlockRow>('SELECT * FROM lesson_unlocks;');
  },

  getLessonIds(): Set<string> {
    const rows = getDb().getAllSync<{ lesson_id: string }>('SELECT lesson_id FROM lesson_unlocks;');
    return new Set(rows.map((row) => row.lesson_id));
  },

  isPurchased(lessonId: string): boolean {
    const row = getDb().getFirstSync<{ lesson_id: string }>(
      'SELECT lesson_id FROM lesson_unlocks WHERE lesson_id = ?;',
      [lessonId]
    );
    return row != null;
  },

  add(lessonId: string, costPaid: number, unlockedAt: number): void {
    getDb().runSync(
      `INSERT OR IGNORE INTO lesson_unlocks
         (lesson_id, cost_paid, unlocked_at)
       VALUES (?, ?, ?);`,
      [lessonId, costPaid, unlockedAt]
    );
  },
};
