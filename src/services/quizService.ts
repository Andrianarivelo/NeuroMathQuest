import { getNotationTerms } from '../content/notationTerms';
import { allLessons } from '../content/tracks';
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

function uniqueStrings(values: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values.map((v) => v.trim()).filter(Boolean)) {
    const key = value.toLocaleLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(value);
  }
  return result;
}

function toFourOptions(values: string[]): [string, string, string, string] {
  return [values[0], values[1], values[2], values[3]];
}

function toAnswerIndex(index: number): 0 | 1 | 2 | 3 {
  return Math.max(0, Math.min(3, index)) as 0 | 1 | 2 | 3;
}

function distractorsFrom(field: (lesson: Lesson) => string, currentLessonId: string): string[] {
  return uniqueStrings(
    allLessons
      .filter((lesson) => lesson.id !== currentLessonId)
      .map(field)
      .filter((value) => value.length <= 180)
  );
}

function compactChoice(value: string, maxLength = 92): string {
  const text = value.replace(/\s+/g, ' ').trim();
  if (text.length <= maxLength) return text;

  const slice = text.slice(0, maxLength);
  const cutAt = Math.max(
    slice.lastIndexOf('. '),
    slice.lastIndexOf('; '),
    slice.lastIndexOf(' - '),
    slice.lastIndexOf(', '),
    slice.lastIndexOf(': ')
  );
  const compact = cutAt >= 45 ? slice.slice(0, cutAt) : slice.replace(/\s+\S*$/, '');
  return `${compact.replace(/[.,;:\s-]+$/, '')}.`;
}

function createQuestion(params: {
  id: string;
  prompt: string;
  answer: string;
  distractors: string[];
  explanation: string;
}): QuizQuestionWithId | null {
  const choices = uniqueStrings([params.answer, ...params.distractors].map((choice) => compactChoice(choice))).slice(0, 4);
  if (choices.length < 4) return null;
  const options = toFourOptions(choices);
  const compactAnswer = compactChoice(params.answer);
  return {
    id: params.id,
    source: 'generated',
    prompt: params.prompt,
    options,
    answerIndex: toAnswerIndex(options.findIndex((choice) => choice === compactAnswer)),
    explanation: compactChoice(params.explanation, 120),
  };
}

export function buildQuizPool(lesson: Lesson): QuizQuestionWithId[] {
  const original: QuizQuestionWithId[] = lesson.questions.map((question, index) => ({
    ...question,
    id: `${lesson.id}_q${index}`,
    source: 'lesson',
  }));

  const generated: Array<QuizQuestionWithId | null> = [
    createQuestion({
      id: `${lesson.id}_intuition`,
      prompt: `Best mental model for "${lesson.title}"?`,
      answer: lesson.intuition,
      distractors: distractorsFrom((item) => item.intuition, lesson.id),
      explanation: lesson.intuition,
    }),
    createQuestion({
      id: `${lesson.id}_example`,
      prompt: `Best example of "${lesson.title}"?`,
      answer: lesson.example,
      distractors: distractorsFrom((item) => item.example, lesson.id),
      explanation: lesson.example,
    }),
    createQuestion({
      id: `${lesson.id}_why`,
      prompt: `Why does "${lesson.title}" matter?`,
      answer: lesson.whyItMatters,
      distractors: distractorsFrom((item) => item.whyItMatters, lesson.id),
      explanation: lesson.whyItMatters,
    }),
  ];

  getNotationTerms(lesson)
    .slice(0, 3)
    .forEach((term, index) => {
      const distractors = uniqueStrings(
        allLessons
          .flatMap((item) => getNotationTerms(item))
          .filter((item) => item.meaning !== term.meaning)
          .map((item) => item.meaning)
          .filter((item) => item.length <= 120)
      );
      generated.push(
        createQuestion({
          id: `${lesson.id}_notation_${index}`,
          prompt: `In "${lesson.title}", what does ${term.symbol} mean?`,
          answer: term.meaning,
          distractors,
          explanation: `${term.symbol}: ${term.meaning}`,
        })
      );
    });

  return [...original, ...generated.filter((item): item is QuizQuestionWithId => item != null)];
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
  desiredCount = 5
): QuizQuestionWithId[] {
  const pool = buildQuizPool(lesson);
  const selected = shuffle(pool, `${lesson.id}:${seed}`).slice(0, Math.min(desiredCount, pool.length));
  return selected.map((question, index) => shuffleOptions(question, `${lesson.id}:${seed}:options:${index}`));
}
