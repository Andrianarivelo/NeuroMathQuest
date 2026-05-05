import * as SQLite from 'expo-sqlite';
import { CREATE_STATEMENTS } from './schema';

let _db: SQLite.SQLiteDatabase | null = null;
let _initialized = false;

export function getDb(): SQLite.SQLiteDatabase {
  if (_db) return _db;
  _db = SQLite.openDatabaseSync('neuromath_quest.db');
  return _db;
}

export function initDb(): void {
  if (_initialized) return;
  const db = getDb();
  for (const stmt of CREATE_STATEMENTS) {
    db.execSync(stmt);
  }
  // Seed the single wallet row (id = 1) if missing. INSERT OR IGNORE is a
  // no-op when the row already exists.
  db.execSync(
    "INSERT OR IGNORE INTO rewards_wallet (id, xp_total, coins_total, chests_opened, level) VALUES (1, 0, 0, 0, 1);"
  );
  _initialized = true;
}

export function resetDb(): void {
  const db = getDb();
  db.execSync('DELETE FROM lesson_progress;');
  db.execSync('DELETE FROM quiz_attempts;');
  db.execSync('DELETE FROM streak_log;');
  db.execSync('UPDATE rewards_wallet SET xp_total = 0, coins_total = 0, chests_opened = 0, level = 1 WHERE id = 1;');
  db.execSync('DELETE FROM achievements_unlocked;');
  db.execSync('DELETE FROM daily_quests;');
  db.execSync('DELETE FROM review_state;');
  db.execSync('DELETE FROM app_settings;');
}
