import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';
import { CREATE_STATEMENTS } from './schema';

type DbParams = readonly unknown[];

interface SyncDb {
  execSync(source: string): void;
  runSync(source: string, params?: DbParams): unknown;
  getAllSync<T>(source: string, params?: DbParams): T[];
  getFirstSync<T>(source: string, params?: DbParams): T | null;
}

interface AppSettingRow {
  key: string;
  value: string;
}

interface LessonProgressRow {
  lesson_id: string;
  track_id: string;
  attempts: number;
  best_score: number;
  last_score: number;
  stars: number;
  mastery: string;
  last_attempt_at: number | null;
  completed_at: number | null;
}

interface QuizAttemptRow {
  id: number;
  lesson_id: string;
  correct: number;
  total: number;
  score: number;
  xp_awarded: number;
  coins_awarded: number;
  attempted_at: number;
}

interface StreakDayRow {
  day: string;
  lessons_completed: number;
  xp_earned: number;
}

interface WalletRow {
  id: 1;
  xp_total: number;
  coins_total: number;
  chests_opened: number;
  level: number;
}

interface LessonUnlockRow {
  lesson_id: string;
  cost_paid: number;
  unlocked_at: number;
}

interface AchievementRow {
  achievement_id: string;
  unlocked_at: number;
}

interface DailyQuestRow {
  quest_id: string;
  day: string;
  progress: number;
  target: number;
  completed: number;
}

interface ReviewRow {
  lesson_id: string;
  last_reviewed_at: number | null;
  last_missed_at: number | null;
  priority: number;
}

interface WebStore {
  app_settings: AppSettingRow[];
  lesson_progress: LessonProgressRow[];
  quiz_attempts: QuizAttemptRow[];
  streak_log: StreakDayRow[];
  rewards_wallet: WalletRow;
  lesson_unlocks: LessonUnlockRow[];
  achievements_unlocked: AchievementRow[];
  daily_quests: DailyQuestRow[];
  review_state: ReviewRow[];
  quizAttemptNextId: number;
}

const WEB_DB_KEY = 'neuromath_quest_web_db_v1';

let _db: SyncDb | null = null;
let _initialized = false;
let memoryWebStore: WebStore | null = null;

export function getDb(): SyncDb {
  if (_db) return _db;
  _db =
    Platform.OS === 'web'
      ? createWebDb()
      : (SQLite.openDatabaseSync('neuromath_quest.db') as unknown as SyncDb);
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
  db.execSync('DELETE FROM lesson_unlocks;');
  db.execSync('DELETE FROM achievements_unlocked;');
  db.execSync('DELETE FROM daily_quests;');
  db.execSync('DELETE FROM review_state;');
  db.execSync('DELETE FROM app_settings;');
}

function createEmptyStore(): WebStore {
  return {
    app_settings: [],
    lesson_progress: [],
    quiz_attempts: [],
    streak_log: [],
    rewards_wallet: {
      id: 1,
      xp_total: 0,
      coins_total: 0,
      chests_opened: 0,
      level: 1,
    },
    lesson_unlocks: [],
    achievements_unlocked: [],
    daily_quests: [],
    review_state: [],
    quizAttemptNextId: 1,
  };
}

function getStorage(): Storage | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function readWebStore(): WebStore {
  const storage = getStorage();
  if (!storage) {
    memoryWebStore ??= createEmptyStore();
    return memoryWebStore;
  }

  const stored = storage.getItem(WEB_DB_KEY);
  if (!stored) return createEmptyStore();

  try {
    const parsed = JSON.parse(stored) as Partial<WebStore>;
    return {
      ...createEmptyStore(),
      ...parsed,
      rewards_wallet: {
        ...createEmptyStore().rewards_wallet,
        ...parsed.rewards_wallet,
        id: 1,
      },
    };
  } catch {
    return createEmptyStore();
  }
}

function writeWebStore(store: WebStore): void {
  const storage = getStorage();
  if (!storage) {
    memoryWebStore = store;
    return;
  }

  storage.setItem(WEB_DB_KEY, JSON.stringify(store));
}

function mutateWebStore(action: (store: WebStore) => void): void {
  const store = readWebStore();
  action(store);
  writeWebStore(store);
}

function normalizeSql(source: string): string {
  return source.replace(/\s+/g, ' ').trim();
}

function splitStatements(source: string): string[] {
  return source
    .split(';')
    .map((stmt) => stmt.trim())
    .filter(Boolean)
    .map((stmt) => `${stmt};`);
}

function firstParam<T>(params: DbParams | undefined, index: number): T {
  return params?.[index] as T;
}

function createWebDb(): SyncDb {
  return {
    execSync(source: string): void {
      for (const statement of splitStatements(source)) {
        executeWebStatement(statement);
      }
    },

    runSync(source: string, params?: DbParams): unknown {
      executeWebRun(source, params);
      return undefined;
    },

    getAllSync<T>(source: string, params?: DbParams): T[] {
      return executeWebGetAll(source, params) as T[];
    },

    getFirstSync<T>(source: string, params?: DbParams): T | null {
      const rows = executeWebGetAll(source, params);
      return (rows[0] as T | undefined) ?? null;
    },
  };
}

function executeWebStatement(source: string): void {
  const sql = normalizeSql(source);
  const upper = sql.toUpperCase();

  if (upper.startsWith('CREATE TABLE')) return;

  if (upper.startsWith('INSERT OR IGNORE INTO REWARDS_WALLET')) {
    mutateWebStore((store) => {
      store.rewards_wallet = store.rewards_wallet ?? createEmptyStore().rewards_wallet;
    });
    return;
  }

  if (upper === 'DELETE FROM LESSON_PROGRESS;') {
    mutateWebStore((store) => {
      store.lesson_progress = [];
    });
    return;
  }

  if (upper === 'DELETE FROM QUIZ_ATTEMPTS;') {
    mutateWebStore((store) => {
      store.quiz_attempts = [];
      store.quizAttemptNextId = 1;
    });
    return;
  }

  if (upper === 'DELETE FROM STREAK_LOG;') {
    mutateWebStore((store) => {
      store.streak_log = [];
    });
    return;
  }

  if (upper === 'UPDATE REWARDS_WALLET SET XP_TOTAL = 0, COINS_TOTAL = 0, CHESTS_OPENED = 0, LEVEL = 1 WHERE ID = 1;') {
    mutateWebStore((store) => {
      store.rewards_wallet = createEmptyStore().rewards_wallet;
    });
    return;
  }

  if (upper === 'DELETE FROM LESSON_UNLOCKS;') {
    mutateWebStore((store) => {
      store.lesson_unlocks = [];
    });
    return;
  }

  if (upper === 'DELETE FROM ACHIEVEMENTS_UNLOCKED;') {
    mutateWebStore((store) => {
      store.achievements_unlocked = [];
    });
    return;
  }

  if (upper === 'DELETE FROM DAILY_QUESTS;') {
    mutateWebStore((store) => {
      store.daily_quests = [];
    });
    return;
  }

  if (upper === 'DELETE FROM REVIEW_STATE;') {
    mutateWebStore((store) => {
      store.review_state = [];
    });
    return;
  }

  if (upper === 'DELETE FROM APP_SETTINGS;') {
    mutateWebStore((store) => {
      store.app_settings = [];
    });
    return;
  }

  throw new Error(`Unsupported web SQL statement: ${sql}`);
}

function executeWebRun(source: string, params: DbParams | undefined): void {
  const sql = normalizeSql(source);
  const upper = sql.toUpperCase();

  if (upper.startsWith('INSERT INTO APP_SETTINGS')) {
    const key = firstParam<string>(params, 0);
    const value = firstParam<string>(params, 1);
    mutateWebStore((store) => {
      const existing = store.app_settings.find((row) => row.key === key);
      if (existing) existing.value = value;
      else store.app_settings.push({ key, value });
    });
    return;
  }

  if (upper.startsWith('INSERT INTO LESSON_PROGRESS')) {
    const row: LessonProgressRow = {
      lesson_id: firstParam<string>(params, 0),
      track_id: firstParam<string>(params, 1),
      attempts: firstParam<number>(params, 2),
      best_score: firstParam<number>(params, 3),
      last_score: firstParam<number>(params, 4),
      stars: firstParam<number>(params, 5),
      mastery: firstParam<string>(params, 6),
      last_attempt_at: firstParam<number | null>(params, 7),
      completed_at: firstParam<number | null>(params, 8),
    };

    mutateWebStore((store) => {
      const existing = store.lesson_progress.find((item) => item.lesson_id === row.lesson_id);
      if (existing) {
        existing.track_id = row.track_id;
        existing.attempts = row.attempts;
        existing.best_score = row.best_score;
        existing.last_score = row.last_score;
        existing.stars = row.stars;
        existing.mastery = row.mastery;
        existing.last_attempt_at = row.last_attempt_at;
        existing.completed_at = existing.completed_at ?? row.completed_at;
      } else {
        store.lesson_progress.push(row);
      }
    });
    return;
  }

  if (upper.startsWith('INSERT INTO QUIZ_ATTEMPTS')) {
    mutateWebStore((store) => {
      store.quiz_attempts.push({
        id: store.quizAttemptNextId,
        lesson_id: firstParam<string>(params, 0),
        correct: firstParam<number>(params, 1),
        total: firstParam<number>(params, 2),
        score: firstParam<number>(params, 3),
        xp_awarded: firstParam<number>(params, 4),
        coins_awarded: firstParam<number>(params, 5),
        attempted_at: firstParam<number>(params, 6),
      });
      store.quizAttemptNextId += 1;
    });
    return;
  }

  if (upper.startsWith('INSERT INTO STREAK_LOG')) {
    const day = firstParam<string>(params, 0);
    const lessons = firstParam<number>(params, 1);
    const xp = firstParam<number>(params, 2);
    mutateWebStore((store) => {
      const existing = store.streak_log.find((row) => row.day === day);
      if (existing && upper.includes('MAX(LESSONS_COMPLETED')) {
        existing.lessons_completed = Math.max(existing.lessons_completed, lessons);
        existing.xp_earned = Math.max(existing.xp_earned, xp);
      } else if (existing) {
        existing.lessons_completed += lessons;
        existing.xp_earned += xp;
      } else {
        store.streak_log.push({ day, lessons_completed: lessons, xp_earned: xp });
      }
    });
    return;
  }

  if (upper === 'UPDATE REWARDS_WALLET SET XP_TOTAL = XP_TOTAL + ? WHERE ID = 1;') {
    mutateWebStore((store) => {
      store.rewards_wallet.xp_total += firstParam<number>(params, 0);
    });
    return;
  }

  if (upper === 'UPDATE REWARDS_WALLET SET COINS_TOTAL = COINS_TOTAL + ? WHERE ID = 1;') {
    mutateWebStore((store) => {
      store.rewards_wallet.coins_total += firstParam<number>(params, 0);
    });
    return;
  }

  if (upper === 'UPDATE REWARDS_WALLET SET COINS_TOTAL = COINS_TOTAL - ? WHERE ID = 1;') {
    mutateWebStore((store) => {
      store.rewards_wallet.coins_total = Math.max(
        0,
        store.rewards_wallet.coins_total - firstParam<number>(params, 0)
      );
    });
    return;
  }

  if (upper === 'UPDATE REWARDS_WALLET SET CHESTS_OPENED = CHESTS_OPENED + 1 WHERE ID = 1;') {
    mutateWebStore((store) => {
      store.rewards_wallet.chests_opened += 1;
    });
    return;
  }

  if (upper === 'UPDATE REWARDS_WALLET SET LEVEL = ? WHERE ID = 1;') {
    mutateWebStore((store) => {
      store.rewards_wallet.level = firstParam<number>(params, 0);
    });
    return;
  }

  if (upper === 'UPDATE REWARDS_WALLET SET XP_TOTAL = ?, COINS_TOTAL = ?, CHESTS_OPENED = ?, LEVEL = ? WHERE ID = 1;') {
    mutateWebStore((store) => {
      store.rewards_wallet.xp_total = firstParam<number>(params, 0);
      store.rewards_wallet.coins_total = firstParam<number>(params, 1);
      store.rewards_wallet.chests_opened = firstParam<number>(params, 2);
      store.rewards_wallet.level = firstParam<number>(params, 3);
    });
    return;
  }

  if (upper.startsWith('INSERT OR IGNORE INTO LESSON_UNLOCKS')) {
    const lesson_id = firstParam<string>(params, 0);
    const cost_paid = firstParam<number>(params, 1);
    const unlocked_at = firstParam<number>(params, 2);
    mutateWebStore((store) => {
      if (!store.lesson_unlocks.some((row) => row.lesson_id === lesson_id)) {
        store.lesson_unlocks.push({ lesson_id, cost_paid, unlocked_at });
      }
    });
    return;
  }

  if (upper.startsWith('INSERT OR IGNORE INTO ACHIEVEMENTS_UNLOCKED')) {
    const achievement_id = firstParam<string>(params, 0);
    const unlocked_at = firstParam<number>(params, 1);
    mutateWebStore((store) => {
      if (!store.achievements_unlocked.some((row) => row.achievement_id === achievement_id)) {
        store.achievements_unlocked.push({ achievement_id, unlocked_at });
      }
    });
    return;
  }

  if (upper.startsWith('INSERT OR IGNORE INTO DAILY_QUESTS')) {
    const quest_id = firstParam<string>(params, 0);
    const day = firstParam<string>(params, 1);
    const target = firstParam<number>(params, 2);
    mutateWebStore((store) => {
      const exists = store.daily_quests.some(
        (row) => row.quest_id === quest_id && row.day === day
      );
      if (!exists) {
        store.daily_quests.push({ quest_id, day, progress: 0, target, completed: 0 });
      }
    });
    return;
  }

  if (upper.startsWith('UPDATE DAILY_QUESTS')) {
    const amount = firstParam<number>(params, 0);
    const quest_id = firstParam<string>(params, 2);
    const day = firstParam<string>(params, 3);
    mutateWebStore((store) => {
      const quest = store.daily_quests.find(
        (row) => row.quest_id === quest_id && row.day === day
      );
      if (!quest) return;
      quest.progress = Math.min(quest.progress + amount, quest.target);
      if (quest.progress >= quest.target) quest.completed = 1;
    });
    return;
  }

  if (upper.startsWith('INSERT INTO REVIEW_STATE')) {
    const row: ReviewRow = {
      lesson_id: firstParam<string>(params, 0),
      last_reviewed_at: firstParam<number | null>(params, 1),
      last_missed_at: firstParam<number | null>(params, 2),
      priority: firstParam<number>(params, 3),
    };
    mutateWebStore((store) => {
      const existing = store.review_state.find((item) => item.lesson_id === row.lesson_id);
      if (existing) Object.assign(existing, row);
      else store.review_state.push(row);
    });
    return;
  }

  throw new Error(`Unsupported web SQL run: ${sql}`);
}

function executeWebGetAll(source: string, params: DbParams | undefined): unknown[] {
  const sql = normalizeSql(source);
  const upper = sql.toUpperCase();
  const store = readWebStore();

  if (upper === 'SELECT KEY, VALUE FROM APP_SETTINGS;') {
    return [...store.app_settings];
  }

  if (upper === 'SELECT * FROM LESSON_PROGRESS;') {
    return [...store.lesson_progress];
  }

  if (upper === 'SELECT * FROM QUIZ_ATTEMPTS ORDER BY ATTEMPTED_AT DESC;') {
    return [...store.quiz_attempts].sort((a, b) => b.attempted_at - a.attempted_at);
  }

  if (upper === 'SELECT * FROM LESSON_PROGRESS WHERE LESSON_ID = ?;') {
    const lessonId = firstParam<string>(params, 0);
    return store.lesson_progress.filter((row) => row.lesson_id === lessonId);
  }

  if (upper === 'SELECT LESSON_ID FROM LESSON_PROGRESS WHERE LAST_ATTEMPT_AT IS NOT NULL ORDER BY LAST_ATTEMPT_AT DESC LIMIT 1;') {
    return [...store.lesson_progress]
      .filter((row) => row.last_attempt_at != null)
      .sort((a, b) => (b.last_attempt_at ?? 0) - (a.last_attempt_at ?? 0))
      .slice(0, 1)
      .map((row) => ({ lesson_id: row.lesson_id }));
  }

  if (upper === 'SELECT * FROM DAILY_QUESTS WHERE DAY = ?;') {
    const day = firstParam<string>(params, 0);
    return store.daily_quests.filter((row) => row.day === day);
  }

  if (upper === 'SELECT * FROM REVIEW_STATE;') {
    return [...store.review_state];
  }

  if (upper === 'SELECT XP_TOTAL, COINS_TOTAL, CHESTS_OPENED, LEVEL FROM REWARDS_WALLET WHERE ID = 1;') {
    const { xp_total, coins_total, chests_opened, level } = store.rewards_wallet;
    return [{ xp_total, coins_total, chests_opened, level }];
  }

  if (upper === 'SELECT * FROM LESSON_UNLOCKS;') {
    return [...store.lesson_unlocks];
  }

  if (upper === 'SELECT LESSON_ID FROM LESSON_UNLOCKS;') {
    return store.lesson_unlocks.map((row) => ({ lesson_id: row.lesson_id }));
  }

  if (upper === 'SELECT LESSON_ID FROM LESSON_UNLOCKS WHERE LESSON_ID = ?;') {
    const lessonId = firstParam<string>(params, 0);
    return store.lesson_unlocks
      .filter((row) => row.lesson_id === lessonId)
      .map((row) => ({ lesson_id: row.lesson_id }));
  }

  if (upper === 'SELECT ACHIEVEMENT_ID FROM ACHIEVEMENTS_UNLOCKED WHERE ACHIEVEMENT_ID = ?;') {
    const achievementId = firstParam<string>(params, 0);
    return store.achievements_unlocked
      .filter((row) => row.achievement_id === achievementId)
      .map((row) => ({ achievement_id: row.achievement_id }));
  }

  if (upper === 'SELECT ACHIEVEMENT_ID FROM ACHIEVEMENTS_UNLOCKED;') {
    return store.achievements_unlocked.map((row) => ({ achievement_id: row.achievement_id }));
  }

  if (upper === 'SELECT DAY, LESSONS_COMPLETED, XP_EARNED FROM STREAK_LOG ORDER BY DAY DESC LIMIT ?;') {
    const limit = firstParam<number>(params, 0);
    return [...store.streak_log].sort((a, b) => b.day.localeCompare(a.day)).slice(0, limit);
  }

  if (upper === 'SELECT DAY, LESSONS_COMPLETED, XP_EARNED FROM STREAK_LOG WHERE DAY = ?;') {
    const day = firstParam<string>(params, 0);
    return store.streak_log.filter((row) => row.day === day);
  }

  throw new Error(`Unsupported web SQL query: ${sql}`);
}
