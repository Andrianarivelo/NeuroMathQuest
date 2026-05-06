import { getLesson } from '../src/content/tracks';
import { buildQuizPool, quizReadyIdeas, selectQuizQuestions } from '../src/services/quizService';

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

  it('creates study-guide ideas from lesson-visible content', () => {
    const ideas = quizReadyIdeas(lesson);
    expect(ideas.length).toBeGreaterThan(3);
    expect(ideas).toContain(lesson.intuition);
  });
});
