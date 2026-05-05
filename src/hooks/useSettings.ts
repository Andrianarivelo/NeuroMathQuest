import { useState, useEffect, useCallback } from 'react';
import { settingsRepository, AppSettings, defaultSettings } from '../repositories/settingsRepository';

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  const refresh = useCallback(() => {
    setSettings(settingsRepository.getAll());
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const update = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    settingsRepository.set(key, value);
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return { settings, update, refresh };
}
