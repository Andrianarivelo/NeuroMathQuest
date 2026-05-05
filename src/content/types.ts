/**
 * Content model for NeuroMath Quest lessons.
 *
 * Content is hand-authored, versioned, and shipped as TypeScript so the
 * TypeScript compiler enforces structure at build time. Seed content is fully
 * offline and deterministic.
 */

export type TrackId = 'neuroscience' | 'math' | 'compneuro' | 'aibasis' | 'aineuro';

export type Difficulty = 'intro' | 'beginner' | 'intermediate' | 'advanced';

export interface QuizQuestion {
  /** Prompt shown to the learner. */
  prompt: string;
  /** Exactly four choices. */
  options: [string, string, string, string];
  /** Index into `options` of the correct answer. */
  answerIndex: 0 | 1 | 2 | 3;
  /** Teaching explanation shown after answering. Keep it short and kind. */
  explanation: string;
}

export interface Lesson {
  id: string;
  trackId: TrackId;
  moduleId: string;
  order: number;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  difficulty: Difficulty;
  prerequisites: string[];
  /** Core explanation in plain beginner-friendly language. */
  explanation: string;
  /** Optional notation block for formal symbols, rendered monospace. */
  notation?: string;
  /** Key vocabulary relevant to this lesson. */
  keyTerms: string[];
  /** One concrete neuroscience example grounding the concept. */
  example: string;
  /** One short "quick intuition" sentence. */
  intuition: string;
  /** Why this concept matters for computational neuroscience. */
  whyItMatters: string;
  /** Exactly three multiple-choice questions. */
  questions: [QuizQuestion, QuizQuestion, QuizQuestion];
  xpReward: number;
  coinReward: number;
  /** Minimum score (0-1) across attempts to count as mastered. */
  masteryThreshold: number;
}

export interface Module {
  id: string;
  trackId: TrackId;
  title: string;
  description: string;
  lessonIds: string[];
}

export interface Track {
  id: TrackId;
  title: string;
  tagline: string;
  description: string;
  color: string;
  /** If true, all lessons in this track are unlocked immediately. */
  unlockedByDefault: boolean;
  modules: Module[];
}
