import { settingsRepository } from '../../repositories/settingsRepository';

function createInstallId(): string {
  const randomUuid = (globalThis.crypto as Crypto | undefined)?.randomUUID?.();
  if (randomUuid) return randomUuid;
  const entropy = Math.random().toString(36).slice(2, 12);
  return `local-${Date.now()}-${entropy}`;
}

export function ensureInstallId(): string {
  const current = settingsRepository.getAll().installId;
  if (current) return current;
  const next = createInstallId();
  settingsRepository.set('installId', next);
  return next;
}
