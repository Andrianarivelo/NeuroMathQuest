/**
 * Encouragement copy banks.
 *
 * Tone rules: warm, respectful, smart, concise, never patronising, never
 * punitive, never sarcastic. Short sentences beat long ones. Avoid exclamation
 * overload.
 */

export type EncouragementContext =
  | 'greeting'
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
  greeting: [
    'Welcome back',
    'Good to see you',
    'Ready for a bright learning moment',
    'Let us build one clear idea today',
    'Your next concept is waiting',
    'Small steps count',
    'You are doing steady work',
  ],
  correct: [
    'Nicely reasoned.',
    'That is the one.',
    'Clean answer. Keep the rhythm.',
    'You are seeing the pattern.',
    'Exactly right. Onwards.',
    'Solid. Your instincts are getting sharper.',
    'Yes. That explanation will stick.',
  ],
  incorrect: [
    'Nice effort. The explanation gives the missing piece.',
    'Not quite yet. You now have a sharper idea.',
    'This is useful practice. Keep going with the next one.',
    'Missed answers are part of learning. You are still moving.',
    'A little off, and that is okay. You just learned something.',
    'Every attempt makes the right idea easier to remember.',
  ],
  first_lesson: [
    'First lesson in the books. That is the hardest one.',
    'You started. That already puts you ahead.',
    'Welcome in. The rhythm gets easier from here.',
  ],
  lesson_complete: [
    'Lesson complete. Small step, real progress.',
    'Done. Your brain just did the work.',
    'One more concept under your belt.',
    'Nicely done. You earned it.',
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
    'Rewards inside. You earned them.',
    'A small prize for a real effort.',
  ],
  quest_complete: [
    'Quest complete. That is momentum.',
    'Quest done. Your brain is building patterns.',
    'Nice work. Quest cleared.',
  ],
  review_win: [
    'Welcome back, concept. You remembered it.',
    'Review win. That memory is stronger now.',
    'Nice recovery. Spaced practice is doing its job.',
  ],
  comeback: [
    'Good to see you again.',
    'Picking up right where you left off.',
    'You came back. That is what learners do.',
  ],
  daily_goal: [
    'Daily goal reached. Rest your eyes and enjoy.',
    'You hit your target. That counts.',
    'Daily goal complete. This kind of day adds up.',
  ],
  milestone: [
    'A real milestone. Look how far you have come.',
    'Milestone unlocked. Serious momentum.',
    'A bigger step than it feels. Well earned.',
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
