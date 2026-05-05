import { useState, useEffect, useCallback } from 'react';
import { progressRepository, LessonProgressRow } from '../repositories/progressRepository';
import { LessonProgressSummary } from '../services/unlockService';

export function useProgress() {
  const [rows, setRows] = useState<LessonProgressRow[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setRows(progressRepository.getAll());
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const progressMap = new Map<string, LessonProgressSummary>(
    rows.map((r) => [
      r.lesson_id,
      { lessonId: r.lesson_id, mastery: r.mastery, bestScore: r.best_score },
    ])
  );

  const completedCount = rows.filter(
    (r) => r.mastery !== 'not_started'
  ).length;

  const masteredCount = rows.filter((r) => r.mastery === 'mastered').length;

  return { rows, progressMap, completedCount, masteredCount, loading, refresh };
}
