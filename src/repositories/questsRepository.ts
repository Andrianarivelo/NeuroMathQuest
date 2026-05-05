import { getDb } from '../db/db';
import { isoDay } from '../utils/date';

export interface DailyQuestRow {
  quest_id: string;
  day: string;
  progress: number;
  target: number;
  completed: number;
}

export const questsRepository = {
  getForDay(day = isoDay()): DailyQuestRow[] {
    return getDb().getAllSync<DailyQuestRow>(
      'SELECT * FROM daily_quests WHERE day = ?;',
      [day]
    );
  },

  seed(day: string, quests: Array<{ id: string; target: number }>): void {
    for (const q of quests) {
      getDb().runSync(
        `INSERT OR IGNORE INTO daily_quests (quest_id, day, progress, target, completed)
         VALUES (?, ?, 0, ?, 0);`,
        [q.id, day, q.target]
      );
    }
  },

  addProgress(id: string, day: string, amount: number): void {
    getDb().runSync(
      `UPDATE daily_quests
         SET progress = MIN(progress + ?, target),
             completed = CASE WHEN progress + ? >= target THEN 1 ELSE completed END
       WHERE quest_id = ? AND day = ?;`,
      [amount, amount, id, day]
    );
  },
};
