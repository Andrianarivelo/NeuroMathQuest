import { Lesson, QuizQuestion } from '../content/types';

export interface QuizQuestionWithId extends QuizQuestion {
  id: string;
  source: 'lesson' | 'generated';
}

function hashSeed(seed: string | number): number {
  const text = String(seed);
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function nextRandom(seed: number): [number, number] {
  const next = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return [next / 4294967296, next];
}

function shuffle<T>(items: T[], seedInput: string | number): T[] {
  const result = [...items];
  let seed = hashSeed(seedInput);
  for (let i = result.length - 1; i > 0; i--) {
    const [value, next] = nextRandom(seed);
    seed = next;
    const j = Math.floor(value * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function toFourOptions(values: string[]): [string, string, string, string] {
  return [values[0], values[1], values[2], values[3]];
}

function toAnswerIndex(index: number): 0 | 1 | 2 | 3 {
  return Math.max(0, Math.min(3, index)) as 0 | 1 | 2 | 3;
}

export function buildQuizPool(lesson: Lesson): QuizQuestionWithId[] {
  return lesson.questions.map((question, index) => ({
    ...question,
    id: `${lesson.id}_q${index}`,
    source: 'lesson',
  }));
}

function shuffleOptions(question: QuizQuestionWithId, seed: string | number): QuizQuestionWithId {
  const answer = question.options[question.answerIndex];
  const options = toFourOptions(shuffle(question.options, seed));
  return {
    ...question,
    options,
    answerIndex: toAnswerIndex(options.findIndex((option) => option === answer)),
  };
}

export function selectQuizQuestions(
  lesson: Lesson,
  seed: string | number = Date.now(),
  desiredCount = 3
): QuizQuestionWithId[] {
  const pool = buildQuizPool(lesson);
  const selected = shuffle(pool, `${lesson.id}:${seed}`).slice(0, Math.min(desiredCount, pool.length));
  return selected.map((question, index) => shuffleOptions(question, `${lesson.id}:${seed}:options:${index}`));
}
