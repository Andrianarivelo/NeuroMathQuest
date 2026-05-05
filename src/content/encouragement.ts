/**
 * Encouragement copy banks.
 *
 * Tone rules: warm, respectful, smart, concise, never patronising, never
 * punitive, never sarcastic. Short sentences beat long ones. Avoid exclamation
 * overload.
 */

export type EncouragementContext =
  | 'correct'
  | 'incorrect'
  | 'first_lesson'
  | 'lesson_complete'
  | 'mastery'
  | 'streak_saved'
  | 'chest_opened'
  | 'quest_complete'
  | 'review_win'
  | 'comeback'
  | 'daily_goal'
  | 'milestone';

export const encouragementCopy: Record<EncouragementContext, string[]> = {
  correct: [
    'Nicely reasoned.',
    'That is the one.',
    'Clean answer. Keep the rhythm.',
    'You are seeing the pattern.',
    'Exactly right \u2014 onwards.',
    'Solid. Your instincts are getting sharper.',
    'Yes. That explanation will stick.',
  ],
  incorrect: [
    'Close. Read the explanation and try the next one.',
    'Not quite \u2014 but now you have a sharper idea.',
    'This is how memory actually forms. Keep going.',
    'Missed answers count as practice. You are still moving.',
    'A little off, and that is okay. You just learned something.',
    'Every wrong answer tightens the right one.',
  ],
  first_lesson: [
    'First lesson in the books. That is the hardest one.',
    'You started. That already puts you ahead.',
    'Welcome in \u2014 the rhythm gets easier from here.',
  ],
  lesson_complete: [
    'Lesson complete. Small step, real progress.',
    'Done. Your brain just did the work.',
    'One more concept under your belt.',
    'Nicely done \u2014 you earned it.',
  ],
  mastery: [
    'Concept mastered. You have earned that star.',
    'You own this one now.',
    'Mastery unlocked. This will carry you.',
  ],
  streak_saved: [
    'Streak still alive. That consistency matters.',
    'Another day, another step. Streak protected.',
    'You showed up. That is the whole trick.',
  ],
  chest_opened: [
    'Chest opened. Enjoy the loot.',
    'Rewards inside \u2014 you earned them.',
    'A small prize for a real effort.',
  ],
  quest_complete: [
    'Quest complete. That is momentum.',
    'Quest done. Your brain is building patterns.',
    'Nice work \u2014 quest cleared.',
  ],
  review_win: [
    'Welcome back, concept. You remembered it.',
    'Review win. That memory is stronger now.',
    'Nice recovery. Spaced practice is doing its job.',
  ],
  comeback: [
    'Good to see you again.',
    'Picking up right where you left off.',
    'You came back \u2014 that is what learners do.',
  ],
  daily_goal: [
    'Daily goal reached. Rest your eyes and enjoy.',
    'You hit your target. That counts.',
    'Daily goal complete \u2014 the kind of day that adds up.',
  ],
  milestone: [
    'A real milestone. Look how far you have come.',
    'Milestone unlocked. Serious momentum.',
    'A bigger step than it feels \u2014 well earned.',
  ],
};

/** Deterministic pick so a given (context, seed) pair always returns the same string. */
export function pickEncouragement(context: EncouragementContext, seed = 0): string {
  const bank = encouragementCopy[context];
  const safe = Math.abs(Math.floor(seed)) % bank.length;
  return bank[safe];
}

/** Random pick when deterministic choice is not needed. */
export function randomEncouragement(context: EncouragementContext): string {
  const bank = encouragementCopy[context];
  return bank[Math.floor(Math.random() * bank.length)];
}
