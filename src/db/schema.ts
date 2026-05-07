/**
 * SQL schema for NeuroMath Quest. All tables are created on first run if
 * missing. Lessons are content-addressed by their TypeScript id (e.g. "A01"),
 * not by a database row.
 */

export const SCHEMA_VERSION = 1;

export const CREATE_STATEMENTS: string[] = [
  `CREATE TABLE IF NOT EXISTS app_settings (
     key TEXT PRIMARY KEY NOT NULL,
     value TEXT NOT NULL
   );`,

  `CREATE TABLE IF NOT EXISTS lesson_progress (
     lesson_id TEXT PRIMARY KEY NOT NULL,
     track_id TEXT NOT NULL,
     attempts INTEGER NOT NULL DEFAULT 0,
     best_score REAL NOT NULL DEFAULT 0,
     last_score REAL NOT NULL DEFAULT 0,
     stars INTEGER NOT NULL DEFAULT 0,
     mastery TEXT NOT NULL DEFAULT 'not_started',
     last_attempt_at INTEGER,
     completed_at INTEGER
   );`,

  `CREATE TABLE IF NOT EXISTS quiz_attempts (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     lesson_id TEXT NOT NULL,
     correct INTEGER NOT NULL,
     total INTEGER NOT NULL,
     score REAL NOT NULL,
     xp_awarded INTEGER NOT NULL,
     coins_awarded INTEGER NOT NULL,
     attempted_at INTEGER NOT NULL
   );`,

  `CREATE TABLE IF NOT EXISTS streak_log (
     day TEXT PRIMARY KEY NOT NULL,
     lessons_completed INTEGER NOT NULL DEFAULT 0,
     xp_earned INTEGER NOT NULL DEFAULT 0
   );`,

  `CREATE TABLE IF NOT EXISTS rewards_wallet (
     id INTEGER PRIMARY KEY CHECK (id = 1),
     xp_total INTEGER NOT NULL DEFAULT 0,
     coins_total INTEGER NOT NULL DEFAULT 0,
     chests_opened INTEGER NOT NULL DEFAULT 0,
     level INTEGER NOT NULL DEFAULT 1
   );`,

  `CREATE TABLE IF NOT EXISTS lesson_unlocks (
     lesson_id TEXT PRIMARY KEY NOT NULL,
     cost_paid INTEGER NOT NULL,
     unlocked_at INTEGER NOT NULL
   );`,

  `CREATE TABLE IF NOT EXISTS achievements_unlocked (
     achievement_id TEXT PRIMARY KEY NOT NULL,
     unlocked_at INTEGER NOT NULL
   );`,

  `CREATE TABLE IF NOT EXISTS daily_quests (
     quest_id TEXT NOT NULL,
     day TEXT NOT NULL,
     progress INTEGER NOT NULL DEFAULT 0,
     target INTEGER NOT NULL,
     completed INTEGER NOT NULL DEFAULT 0,
     PRIMARY KEY (quest_id, day)
   );`,

  `CREATE TABLE IF NOT EXISTS review_state (
     lesson_id TEXT PRIMARY KEY NOT NULL,
     last_reviewed_at INTEGER,
     last_missed_at INTEGER,
     priority REAL NOT NULL DEFAULT 0
   );`,
];
