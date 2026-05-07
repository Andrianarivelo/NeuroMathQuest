import { getNotationTerms } from '../content/notationTerms';
import { allLessons } from '../content/tracks';
import { buildCourseDetails } from './lessonContentService';
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

function splitSentences(value: string): string[] {
  return (value.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [])
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length >= 32);
}

const lessonStatementCache = new Map<string, string[]>();

function lessonStatements(lesson: Lesson): string[] {
  const cached = lessonStatementCache.get(lesson.id);
  if (cached) return cached;
  const statements = uniqueStrings([
    ...splitSentences(lesson.explanation),
    ...buildCourseDetails(lesson),
    ...lesson.questions.map((question) => question.explanation),
    lesson.example,
    lesson.whyItMatters,
  ]).filter((value) => value.length <= 180);
  lessonStatementCache.set(lesson.id, statements);
  return statements;
}

function statementForTerm(lesson: Lesson, term: string): string | null {
  const normalizedTerm = normalizeText(term);
  const termWords = normalizedTerm.split(' ').filter((word) => word.length >= 4);
  return (
    lessonStatements(lesson).find((statement) => {
      const normalizedStatement = normalizeText(statement);
      return (
        normalizedStatement.includes(normalizedTerm) ||
        termWords.some((word) => normalizedStatement.includes(word))
      );
    }) ?? null
  );
}

function conceptDistractors(lesson: Lesson, answer: string): string[] {
  return uniqueStrings([
    ...lessonStatements(lesson).filter((statement) => statement !== answer),
    ...allLessons
      .filter((item) => item.trackId === lesson.trackId && item.id !== lesson.id)
      .flatMap((item) => lessonStatements(item)),
    ...allLessons
      .filter((item) => item.id !== lesson.id)
      .flatMap((item) => lessonStatements(item)),
  ]).filter((value) => value.length <= 180);
}

function cleanTerm(term: string): string {
  return term.replace(/\s+/g, ' ').trim();
}

function normalizeText(value: string): string {
  return value.toLocaleLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function conceptQuestionPrompt(lesson: Lesson, term: string, index: number): string {
  const compactTerm = cleanTerm(term);
  if (index % 2 === 0) {
    return `What is ${compactTerm} in ${lesson.title}?`;
  }
  return `Which statement about ${compactTerm} matches ${lesson.title}?`;
}

function directQuestionPrompt(lesson: Lesson, question: QuizQuestion): string {
  const prompt = `${lesson.title}: ${question.prompt}`;
  return prompt.length <= 132 ? prompt : question.prompt;
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

  uniqueStrings(lesson.keyTerms)
    .slice(0, 4)
    .forEach((term, index) => {
      const answer = statementForTerm(lesson, term);
      if (!answer) return;
      generated.push(
        createQuestion({
          id: `${lesson.id}_concept_${index}`,
          prompt: conceptQuestionPrompt(lesson, term, index),
          answer,
          distractors: conceptDistractors(lesson, answer),
          explanation: answer,
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
          prompt: `What does ${term.symbol} mean in ${lesson.title}?`,
          answer: term.meaning,
          distractors,
          explanation: `${term.symbol}: ${term.meaning}`,
        })
      );
    });

  for (let index = 0; generated.filter((item) => item != null).length < 2 && index < lesson.questions.length; index++) {
    const question = lesson.questions[index];
    const answer = question.options[question.answerIndex];
    generated.push(
      createQuestion({
        id: `${lesson.id}_direct_${index}`,
        prompt: directQuestionPrompt(lesson, question),
        answer,
        distractors: question.options.filter((option) => option !== answer),
        explanation: question.explanation,
      })
    );
  }

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
