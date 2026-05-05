import { getDb } from '../db/db';
import { MasteryLevel } from '../services/masteryService';

export interface LessonProgressRow {
  lesson_id: string;
  track_id: string;
  attempts: number;
  best_score: number;
  last_score: number;
  stars: number;
  mastery: MasteryLevel;
  last_attempt_at: number | null;
  completed_at: number | null;
}

export const progressRepository = {
  getAll(): LessonProgressRow[] {
    return getDb().getAllSync<LessonProgressRow>('SELECT * FROM lesson_progress;');
  },

  getByLesson(lessonId: string): LessonProgressRow | null {
    const row = getDb().getFirstSync<LessonProgressRow>(
      'SELECT * FROM lesson_progress WHERE lesson_id = ?;',
      [lessonId]
    );
    return row ?? null;
  },

  upsert(row: LessonProgressRow): void {
    getDb().runSync(
      `INSERT INTO lesson_progress
         (lesson_id, track_id, attempts, best_score, last_score, stars, mastery, last_attempt_at, completed_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(lesson_id) DO UPDATE SET
         track_id = excluded.track_id,
         attempts = excluded.attempts,
         best_score = excluded.best_score,
         last_score = excluded.last_score,
         stars = excluded.stars,
         mastery = excluded.mastery,
         last_attempt_at = excluded.last_attempt_at,
         completed_at = COALESCE(lesson_progress.completed_at, excluded.completed_at);`,
      [
        row.lesson_id,
        row.track_id,
        row.attempts,
        row.best_score,
        row.last_score,
        row.stars,
        row.mastery,
        row.last_attempt_at,
        row.completed_at,
      ]
    );
  },

  recordAttempt(params: {
    lessonId: string;
    correct: number;
    total: number;
    score: number;
    xpAwarded: number;
    coinsAwarded: number;
    timestamp: number;
  }): void {
    getDb().runSync(
      `INSERT INTO quiz_attempts
         (lesson_id, correct, total, score, xp_awarded, coins_awarded, attempted_at)
       VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [
        params.lessonId,
        params.correct,
        params.total,
        params.score,
        params.xpAwarded,
        params.coinsAwarded,
        params.timestamp,
      ]
    );
  },

  lastOpenedLesson(): string | null {
    const row = getDb().getFirstSync<{ lesson_id: string }>(
      'SELECT lesson_id FROM lesson_progress WHERE last_attempt_at IS NOT NULL ORDER BY last_attempt_at DESC LIMIT 1;'
    );
    return row?.lesson_id ?? null;
  },
};
