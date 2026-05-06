/**
 * Daily quest engine.
 *
 * Pure functions for quest definition + progression. A small deterministic
 * "seed" (the ISO day) ensures the same day always produces the same quest set.
 */

export type QuestId =
  | 'two_lessons'
  | 'earn_30_xp'
  | 'master_one'
  | 'one_review'
  | 'one_neuro_one_math'
  | 'keep_streak';

export interface QuestDefinition {
  id: QuestId;
  title: string;
  description: string;
  target: number;
  icon: 'spark' | 'flame' | 'brain' | 'star' | 'leaf' | 'trophy';
}

export const QUEST_BANK: Record<QuestId, QuestDefinition> = {
  two_lessons: {
    id: 'two_lessons',
    title: 'Two lessons today',
    description: 'Finish any two lessons.',
    target: 2,
    icon: 'spark',
  },
  earn_30_xp: {
    id: 'earn_30_xp',
    title: 'Earn 30 XP',
    description: 'Stack up 30 XP from any activity.',
    target: 30,
    icon: 'trophy',
  },
  master_one: {
    id: 'master_one',
    title: 'Master one concept',
    description: 'Push any lesson to mastered.',
    target: 1,
    icon: 'star',
  },
  one_review: {
    id: 'one_review',
    title: 'One exam session',
    description: 'Finish one mixed exam.',
    target: 1,
    icon: 'leaf',
  },
  one_neuro_one_math: {
    id: 'one_neuro_one_math',
    title: 'Bridge the worlds',
    description: 'Complete one neuroscience lesson and one math lesson.',
    target: 2,
    icon: 'brain',
  },
  keep_streak: {
    id: 'keep_streak',
    title: 'Keep the streak alive',
    description: 'Do any lesson today.',
    target: 1,
    icon: 'flame',
  },
};

/** Pick three quests for a given day deterministically. */
export function questsForDay(dayIso: string): QuestDefinition[] {
  const hash = hashString(dayIso);
  const ids: QuestId[] = Object.keys(QUEST_BANK) as QuestId[];
  const chosen: QuestDefinition[] = [];
  const used = new Set<number>();
  while (chosen.length < 3 && used.size < ids.length) {
    const index = (hash + chosen.length * 7) % ids.length;
    if (!used.has(index)) {
      used.add(index);
      chosen.push(QUEST_BANK[ids[index]]);
    }
  }
  return chosen;
}

export interface QuestEventInput {
  lessonsCompleted: number;
  xpEarned: number;
  masteryEvents: number;
  reviewSessions: number;
  neuroLessonsCompleted: number;
  mathLessonsCompleted: number;
}

export function questProgressDelta(quest: QuestId, evt: QuestEventInput): number {
  switch (quest) {
    case 'two_lessons':
      return evt.lessonsCompleted;
    case 'earn_30_xp':
      return evt.xpEarned;
    case 'master_one':
      return evt.masteryEvents;
    case 'one_review':
      return evt.reviewSessions;
    case 'one_neuro_one_math':
      return Math.min(evt.neuroLessonsCompleted, 1) + Math.min(evt.mathLessonsCompleted, 1);
    case 'keep_streak':
      return evt.lessonsCompleted >= 1 ? 1 : 0;
  }
}

export function isQuestComplete(progress: number, target: number): boolean {
  return progress >= target;
}

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}
