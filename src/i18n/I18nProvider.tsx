import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { settingsRepository } from '../repositories/settingsRepository';
import { AppLanguage, translateText } from './translations';

interface I18nContextValue {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  t: (value: string) => string;
}

const I18nContext = createContext<I18nContextValue>({
  language: 'en',
  setLanguage: () => undefined,
  t: (value) => value,
});

interface Props {
  initialLanguage: AppLanguage;
  children: React.ReactNode;
}

export function I18nProvider({ initialLanguage, children }: Props) {
  const [language, setLanguageState] = useState<AppLanguage>(initialLanguage);

  const setLanguage = useCallback((nextLanguage: AppLanguage) => {
    settingsRepository.set('language', nextLanguage);
    setLanguageState(nextLanguage);
  }, []);

  const t = useCallback((value: string) => translateText(value, language), [language]);

  const value = useMemo(
    () => ({ language, setLanguage, t }),
    [language, setLanguage, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
