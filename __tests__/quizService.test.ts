import { allLessons, getLesson } from '../src/content/tracks';
import { buildQuizPool, selectQuizQuestions } from '../src/services/quizService';

describe('quizService', () => {
  const lesson = getLesson('A01')!;

  it('builds a larger pool than the base lesson questions', () => {
    const pool = buildQuizPool(lesson);
    expect(pool.length).toBeGreaterThan(lesson.questions.length);
    expect(pool.every((question) => question.options.length === 4)).toBe(true);
    expect(pool.every((question) => question.answerIndex >= 0)).toBe(true);
  });

  it('selects a varied five-question quiz for different seeds', () => {
    const first = selectQuizQuestions(lesson, 'attempt-1');
    const second = selectQuizQuestions(lesson, 'attempt-2');
    expect(first).toHaveLength(5);
    expect(second).toHaveLength(5);
    expect(first.map((question) => question.id).join(',')).not.toBe(
      second.map((question) => question.id).join(',')
    );
  });

  it('does not generate low-value key-term recognition questions', () => {
    const pool = buildQuizPool(lesson);
    expect(pool.some((question) => question.id.includes('_term_'))).toBe(false);
    expect(pool.some((question) => /key term|appears in this lesson/i.test(question.prompt))).toBe(false);
  });

  it('does not generate generic mental-model or example-matching prompts', () => {
    const generated = allLessons.flatMap((item) =>
      buildQuizPool(item).filter((question) => question.source === 'generated')
    );
    expect(generated.some((question) => /^best mental model/i.test(question.prompt))).toBe(false);
    expect(generated.some((question) => /^best example/i.test(question.prompt))).toBe(false);
    expect(generated.some((question) => /best mental model|best example of/i.test(question.prompt))).toBe(false);
  });

  it('adds lesson context to generated conceptual prompts', () => {
    const generated = buildQuizPool(lesson).filter((question) => question.source === 'generated');
    expect(generated.length).toBeGreaterThan(0);
    expect(generated.every((question) => question.prompt.includes(lesson.title))).toBe(true);
  });

  it('keeps generated answer choices short enough for mobile cards', () => {
    const generated = allLessons.flatMap((item) =>
      buildQuizPool(item).filter((question) => question.source === 'generated')
    );
    expect(generated.flatMap((question) => question.options).every((option) => option.length <= 92)).toBe(true);
    expect(generated.every((question) => question.explanation.length <= 120)).toBe(true);
  });
});
