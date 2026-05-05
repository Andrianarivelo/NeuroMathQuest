import { getDb } from '../db/db';

export interface ReviewRow {
  lesson_id: string;
  last_reviewed_at: number | null;
  last_missed_at: number | null;
  priority: number;
}

export const reviewRepository = {
  upsert(row: ReviewRow): void {
    getDb().runSync(
      `INSERT INTO review_state (lesson_id, last_reviewed_at, last_missed_at, priority)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(lesson_id) DO UPDATE SET
         last_reviewed_at = excluded.last_reviewed_at,
         last_missed_at = excluded.last_missed_at,
         priority = excluded.priority;`,
      [row.lesson_id, row.last_reviewed_at, row.last_missed_at, row.priority]
    );
  },

  all(): ReviewRow[] {
    return getDb().getAllSync<ReviewRow>('SELECT * FROM review_state;');
  },
};
