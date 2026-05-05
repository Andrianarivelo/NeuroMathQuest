export interface Achievement {
  id: string;
  title: string;
  description: string;
  /** SVG icon name consumed by components/AchievementBadge. */
  icon: 'spark' | 'flame' | 'star' | 'brain' | 'rocket' | 'chest' | 'trophy' | 'leaf';
  /** Target value to unlock (semantics depend on the achievement id). */
  target: number;
}

export const achievements: Achievement[] = [
  { id: 'ach_first_lesson', title: 'First Step',          description: 'Complete your first lesson.',          icon: 'spark', target: 1 },
  { id: 'ach_five_lessons', title: 'Momentum',            description: 'Complete five lessons.',              icon: 'rocket', target: 5 },
  { id: 'ach_ten_lessons',  title: 'Double Digits',       description: 'Complete ten lessons.',               icon: 'rocket', target: 10 },
  { id: 'ach_twenty',       title: 'Quarter Master',      description: 'Complete twenty lessons.',            icon: 'trophy', target: 20 },
  { id: 'ach_forty',        title: 'Halfway There',       description: 'Complete forty lessons.',             icon: 'trophy', target: 40 },
  { id: 'ach_seventy',      title: 'Full Journey',        description: 'Complete every lesson in the app.',   icon: 'trophy', target: 130 },

  { id: 'ach_streak_3',     title: 'On a Roll',           description: 'Reach a 3-day streak.',               icon: 'flame', target: 3 },
  { id: 'ach_streak_7',     title: 'Weekly Rhythm',       description: 'Reach a 7-day streak.',               icon: 'flame', target: 7 },
  { id: 'ach_streak_30',    title: 'Monthlong Habit',     description: 'Reach a 30-day streak.',              icon: 'flame', target: 30 },

  { id: 'ach_xp_100',       title: 'First 100 XP',        description: 'Earn 100 lifetime XP.',               icon: 'spark', target: 100 },
  { id: 'ach_xp_500',       title: 'Five Hundred Club',   description: 'Earn 500 lifetime XP.',               icon: 'spark', target: 500 },
  { id: 'ach_xp_1500',      title: 'Serious Student',     description: 'Earn 1500 lifetime XP.',              icon: 'spark', target: 1500 },

  { id: 'ach_mastery_5',    title: 'Mastery x5',          description: 'Master five concepts.',               icon: 'star', target: 5 },
  { id: 'ach_mastery_15',   title: 'Mastery x15',         description: 'Master fifteen concepts.',            icon: 'star', target: 15 },

  { id: 'ach_brain_basics', title: 'Brain Basics',        description: 'Complete the Neuroscience Basics track.', icon: 'brain', target: 20 },
  { id: 'ach_math_basics',  title: 'Math Mind',           description: 'Complete the Math Foundations track.',    icon: 'leaf',  target: 40 },
  { id: 'ach_compneuro',    title: 'Computational Thinker', description: 'Complete the Computational Neuroscience track.', icon: 'brain', target: 50 },
  { id: 'ach_aibasis',      title: 'AI Apprentice',       description: 'Complete the AI Basics track.',           icon: 'rocket', target: 30 },
  { id: 'ach_aineuro',      title: 'NeuroAI Explorer',    description: 'Complete the NeuroAI track.',             icon: 'brain',  target: 30 },

  { id: 'ach_chest_first',  title: 'First Chest',         description: 'Open your first reward chest.',       icon: 'chest', target: 1 },
  { id: 'ach_chest_ten',    title: 'Treasure Hunter',     description: 'Open ten reward chests.',             icon: 'chest', target: 10 },
];
