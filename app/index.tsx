import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { initDb } from '../src/db/db';
import { settingsRepository } from '../src/repositories/settingsRepository';

export default function Index() {
  const [target, setTarget] = useState<'onboarding' | 'tabs' | null>(null);

  useEffect(() => {
    initDb();
    const s = settingsRepository.getAll();
    setTarget(s.onboardingCompleted ? 'tabs' : 'onboarding');
  }, []);

  if (target === 'onboarding') return <Redirect href="/onboarding/welcome" />;
  if (target === 'tabs') return <Redirect href="/(tabs)/home" />;
  return null;
}
