import { syncLocalProgressToCloud } from '../src/services/backend/syncService';
import { getBackendConfig, isBackendConfigured } from '../src/services/backend/supabaseClient';

describe('cloud sync service', () => {
  it('uses the global Supabase setup while keeping guest mode available', async () => {
    expect(isBackendConfigured()).toBe(true);
    expect(getBackendConfig()).toMatchObject({
      source: 'global',
      supabaseUrl: 'https://owggyopbuftjtfgqinto.supabase.co',
    });

    await expect(syncLocalProgressToCloud()).resolves.toMatchObject({
      status: 'guest',
    });
  });
});
