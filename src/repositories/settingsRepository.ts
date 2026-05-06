import { getDb } from '../db/db';

export interface AppSettings {
  hapticsEnabled: boolean;
  soundEnabled: boolean;
  dailyGoalLessons: number;
  themeMode: 'light' | 'dark' | 'system';
  largeText: boolean;
  reducedMotion: boolean;
  primaryGoal: 'neuroscience' | 'math' | 'both';
  onboardingCompleted: boolean;
  profileName: string;
  superUserEnabled: boolean;
  installId: string;
  cloudSyncLastAt: number;
}

export const defaultSettings: AppSettings = {
  hapticsEnabled: true,
  soundEnabled: true,
  dailyGoalLessons: 2,
  themeMode: 'light',
  largeText: false,
  reducedMotion: false,
  primaryGoal: 'both',
  onboardingCompleted: false,
  profileName: 'NeuroMath Explorer',
  superUserEnabled: false,
  installId: '',
  cloudSyncLastAt: 0,
};

export const settingsRepository = {
  getAll(): AppSettings {
    const rows = getDb().getAllSync<{ key: string; value: string }>(
      'SELECT key, value FROM app_settings;'
    );
    const result: AppSettings = { ...defaultSettings };
    for (const r of rows) {
      switch (r.key) {
        case 'hapticsEnabled':
        case 'soundEnabled':
        case 'largeText':
        case 'reducedMotion':
        case 'onboardingCompleted':
        case 'superUserEnabled':
          (result as any)[r.key] = r.value === '1';
          break;
        case 'profileName':
          result.profileName = r.value || defaultSettings.profileName;
          break;
        case 'installId':
          result.installId = r.value;
          break;
        case 'dailyGoalLessons':
          result.dailyGoalLessons = parseInt(r.value, 10) || defaultSettings.dailyGoalLessons;
          break;
        case 'cloudSyncLastAt':
          result.cloudSyncLastAt = parseInt(r.value, 10) || defaultSettings.cloudSyncLastAt;
          break;
        case 'themeMode':
          result.themeMode = (r.value as AppSettings['themeMode']) ?? defaultSettings.themeMode;
          break;
        case 'primaryGoal':
          result.primaryGoal = (r.value as AppSettings['primaryGoal']) ?? defaultSettings.primaryGoal;
          break;
      }
    }
    return result;
  },

  set<K extends keyof AppSettings>(key: K, value: AppSettings[K]): void {
    const stored = typeof value === 'boolean' ? (value ? '1' : '0') : String(value);
    getDb().runSync(
      'INSERT INTO app_settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value;',
      [key, stored]
    );
  },
};
