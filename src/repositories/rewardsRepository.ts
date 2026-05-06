import { getDb } from '../db/db';

export interface Wallet {
  xpTotal: number;
  coinsTotal: number;
  chestsOpened: number;
  level: number;
}

interface WalletRow {
  xp_total: number;
  coins_total: number;
  chests_opened: number;
  level: number;
}

export const rewardsRepository = {
  get(): Wallet {
    const row = getDb().getFirstSync<WalletRow>(
      'SELECT xp_total, coins_total, chests_opened, level FROM rewards_wallet WHERE id = 1;'
    );
    return {
      xpTotal: row?.xp_total ?? 0,
      coinsTotal: row?.coins_total ?? 0,
      chestsOpened: row?.chests_opened ?? 0,
      level: row?.level ?? 1,
    };
  },

  addXp(xp: number): void {
    getDb().runSync('UPDATE rewards_wallet SET xp_total = xp_total + ? WHERE id = 1;', [xp]);
  },

  addCoins(coins: number): void {
    getDb().runSync('UPDATE rewards_wallet SET coins_total = coins_total + ? WHERE id = 1;', [coins]);
  },

  openChest(): void {
    getDb().runSync('UPDATE rewards_wallet SET chests_opened = chests_opened + 1 WHERE id = 1;');
  },

  setLevel(level: number): void {
    getDb().runSync('UPDATE rewards_wallet SET level = ? WHERE id = 1;', [level]);
  },

  replace(wallet: Wallet): void {
    getDb().runSync(
      'UPDATE rewards_wallet SET xp_total = ?, coins_total = ?, chests_opened = ?, level = ? WHERE id = 1;',
      [wallet.xpTotal, wallet.coinsTotal, wallet.chestsOpened, wallet.level]
    );
  },

  unlockAchievement(id: string, at: number): void {
    getDb().runSync(
      'INSERT OR IGNORE INTO achievements_unlocked (achievement_id, unlocked_at) VALUES (?, ?);',
      [id, at]
    );
  },

  isAchievementUnlocked(id: string): boolean {
    const row = getDb().getFirstSync<{ achievement_id: string }>(
      'SELECT achievement_id FROM achievements_unlocked WHERE achievement_id = ?;',
      [id]
    );
    return row != null;
  },

  listUnlockedAchievements(): string[] {
    return getDb()
      .getAllSync<{ achievement_id: string }>('SELECT achievement_id FROM achievements_unlocked;')
      .map((r) => r.achievement_id);
  },
};
