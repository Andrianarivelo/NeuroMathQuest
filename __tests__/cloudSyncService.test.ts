import { syncLocalProgressToCloud } from '../src/services/backend/syncService';
import { isBackendConfigured } from '../src/services/backend/supabaseClient';

describe('cloud sync service', () => {
  it('keeps guest/offline mode available when Supabase is not configured', async () => {
    expect(isBackendConfigured()).toBe(false);
    await expect(syncLocalProgressToCloud()).resolves.toMatchObject({
      status: 'disabled',
    });
  });
});
