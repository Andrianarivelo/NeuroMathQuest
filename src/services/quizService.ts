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

function explanationDistractors(lesson: Lesson, currentExplanation: string): string[] {
  return uniqueStrings([
    ...lesson.questions
      .map((question) => question.explanation)
      .filter((explanation) => explanation !== currentExplanation),
    ...allLessons
      .filter((item) => item.trackId === lesson.trackId && item.id !== lesson.id)
      .flatMap((item) => item.questions.map((question) => question.explanation)),
    ...allLessons
      .filter((item) => item.id !== lesson.id)
      .flatMap((item) => item.questions.map((question) => question.explanation)),
  ]).filter((value) => value.length <= 160);
}

function optionDistractors(lesson: Lesson, question: QuizQuestion): string[] {
  const correctAnswer = question.options[question.answerIndex];
  return uniqueStrings([
    ...question.options.filter((option) => option !== correctAnswer),
    ...allLessons
      .filter((item) => item.trackId === lesson.trackId && item.id !== lesson.id)
      .flatMap((item) => item.questions.map((candidate) => candidate.options[candidate.answerIndex])),
    ...allLessons
      .filter((item) => item.id !== lesson.id)
      .flatMap((item) => item.questions.map((candidate) => candidate.options[candidate.answerIndex])),
  ]).filter((value) => value.length <= 140);
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

  const generated: Array<QuizQuestionWithId | null> = [];

  lesson.questions.forEach((question, index) => {
    const correctAnswer = question.options[question.answerIndex];
    const wrongAnswer = question.options.find((option) => option !== correctAnswer) ?? question.options[0];

    generated.push(
      createQuestion({
        id: `${lesson.id}_repair_${index}`,
        prompt: `In "${lesson.title}", a learner chose "${compactChoice(wrongAnswer, 54)}". Which correction matches the lesson?`,
        answer: correctAnswer,
        distractors: optionDistractors(lesson, question),
        explanation: question.explanation,
      })
    );

    generated.push(
      createQuestion({
        id: `${lesson.id}_reason_${index}`,
        prompt: `In "${lesson.title}", why is "${compactChoice(correctAnswer, 46)}" the right idea?`,
        answer: question.explanation,
        distractors: explanationDistractors(lesson, question.explanation),
        explanation: question.explanation,
      })
    );
  });

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
