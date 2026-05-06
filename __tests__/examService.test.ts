import { buildExamQuestions } from '../src/services/examService';

describe('examService', () => {
  it('builds a mixed exam from multiple lessons', () => {
    const questions = buildExamQuestions(['A01', 'A02', 'A03'], 'fixed-seed', 6);
    const lessonIds = new Set(questions.map((question) => question.lessonId));

    expect(questions).toHaveLength(6);
    expect(lessonIds.size).toBeGreaterThan(1);
    expect(questions.every((question) => question.examQuestionId.includes(question.lessonId))).toBe(true);
  });

  it('ignores invalid and duplicate lesson ids', () => {
    const questions = buildExamQuestions(['A01', 'A01', 'missing'], 'fixed-seed', 4);

    expect(questions.length).toBeGreaterThan(0);
    expect(questions.every((question) => question.lessonId === 'A01')).toBe(true);
  });
});
