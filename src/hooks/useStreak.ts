import { useState, useEffect, useCallback } from 'react';
import { streakRepository, StreakDay } from '../repositories/streakRepository';
import { isoDay, daysAgo, daysBetween } from '../utils/date';

export function useStreak() {
  const [recent, setRecent] = useState<StreakDay[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [todayLessons, setTodayLessons] = useState(0);
  const [todayXp, setTodayXp] = useState(0);

  const refresh = useCallback(() => {
    const data = streakRepository.recent(90);
    setRecent(data);

    // Compute streak: count backwards from today (or yesterday if today has
    // no activity yet) finding consecutive days with lessons completed.
    const today = isoDay();
    const daysSet = new Map(data.map((d) => [d.day, d]));
    let streak = 0;
    // Start from today; if today has activity it counts.
    const start = daysSet.has(today) ? today : daysAgo(1);
    for (let i = 0; i < 365; i++) {
      const day = daysAgo(i, new Date(start + 'T12:00:00'));
      const entry = daysSet.get(day);
      if (entry && entry.lessonsCompleted > 0) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    setCurrentStreak(streak);

    const todayEntry = daysSet.get(today);
    setTodayLessons(todayEntry?.lessonsCompleted ?? 0);
    setTodayXp(todayEntry?.xpEarned ?? 0);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { recent, currentStreak, todayLessons, todayXp, refresh };
}
