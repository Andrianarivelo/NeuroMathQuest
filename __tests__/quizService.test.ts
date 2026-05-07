import { allLessons, getLesson } from '../src/content/tracks';
import { buildQuizPool, selectQuizQuestions } from '../src/services/quizService';

describe('quizService', () => {
  const lesson = getLesson('A01')!;

  it('uses only the three hand-authored lesson questions', () => {
    const pool = buildQuizPool(lesson);
    expect(pool).toHaveLength(3);
    expect(pool.every((question) => question.source === 'lesson')).toBe(true);
    expect(pool.every((question) => question.options.length === 4)).toBe(true);
    expect(pool.every((question) => question.answerIndex >= 0)).toBe(true);
  });

  it('selects a three-question quiz for lesson completion', () => {
    const first = selectQuizQuestions(lesson, 'attempt-1');
    const second = selectQuizQuestions(lesson, 'attempt-2');
    expect(first).toHaveLength(3);
    expect(second).toHaveLength(3);
    expect(new Set(first.map((question) => question.id))).toEqual(
      new Set(lesson.questions.map((_, index) => `${lesson.id}_q${index}`))
    );
  });

  it('keeps every lesson quiz at exactly three questions', () => {
    for (const item of allLessons) {
      const pool = buildQuizPool(item);
      expect(pool).toHaveLength(3);
    }
  });

  it('does not include generated template prompts', () => {
    const prompts = allLessons.flatMap((item) =>
      buildQuizPool(item).map((question) => ({ lessonTitle: item.title, prompt: question.prompt }))
    );
    expect(prompts.some(({ prompt }) => /key term|appears in this lesson/i.test(prompt))).toBe(false);
    expect(prompts.some(({ prompt }) => /^best mental model/i.test(prompt))).toBe(false);
    expect(prompts.some(({ prompt }) => /^best example/i.test(prompt))).toBe(false);
    expect(prompts.some(({ prompt }) => /best mental model|best example of/i.test(prompt))).toBe(false);
    expect(prompts.some(({ prompt }) => /learner chose|right idea|correction matches/i.test(prompt))).toBe(false);
    expect(
      prompts.some(({ lessonTitle, prompt }) =>
        new RegExp(`what is .+ in ${lessonTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\?`, 'i').test(prompt)
      )
    ).toBe(false);
    expect(
      prompts.some(({ lessonTitle, prompt }) =>
        new RegExp(`which statement about .+ matches ${lessonTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\?`, 'i').test(prompt)
      )
    ).toBe(false);
  });

  it('keeps answer choices short enough for mobile cards', () => {
    const questions = allLessons.flatMap((item) => buildQuizPool(item));
    expect(questions.flatMap((question) => question.options).every((option) => option.length <= 140)).toBe(true);
    expect(questions.every((question) => question.explanation.length <= 180)).toBe(true);
  });
});
