import { useCallback, useEffect, useState } from 'react';
import { lessonUnlocksRepository } from '../repositories/lessonUnlocksRepository';

export function useLessonUnlocks() {
  const [purchasedLessonIds, setPurchasedLessonIds] = useState<Set<string>>(new Set());

  const refresh = useCallback(() => {
    setPurchasedLessonIds(lessonUnlocksRepository.getLessonIds());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { purchasedLessonIds, refresh };
}
