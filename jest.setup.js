// Jest setup for service-level unit tests.
// These run in Node (no React Native runtime), so we mock native modules.

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
  NotificationFeedbackType: { Success: 'success', Warning: 'warning', Error: 'error' },
}));

jest.mock('expo-sqlite', () => {
  return {
    openDatabaseSync: () => ({
      execSync: () => undefined,
      runSync: () => ({ lastInsertRowId: 1, changes: 1 }),
      getFirstSync: () => null,
      getAllSync: () => [],
    }),
  };
});
