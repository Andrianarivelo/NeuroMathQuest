import { getLesson } from '../content/tracks';
import { Lesson } from '../content/types';
import { QuizQuestionWithId, selectQuizQuestions } from './quizService';
import { applyDailyQuestProgress, completeLessonAttempt, LessonAttemptResult } from './lessonService';

export interface ExamQuestion extends QuizQuestionWithId {
  examQuestionId: string;
  lessonId: string;
  lessonTitle: string;
}

export interface ExamLessonResult {
  lessonId: string;
  lessonTitle: string;
  correct: number;
  total: number;
  result: LessonAttemptResult;
}

export interface ExamAttemptResult {
  correct: number;
  total: number;
  score: number;
  xp: number;
  coins: number;
  lessonResults: ExamLessonResult[];
  newAchievements: string[];
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

function uniqueLessonIds(values: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values.map((item) => item.trim()).filter(Boolean)) {
    if (seen.has(value)) continue;
    seen.add(value);
    result.push(value);
  }
  return result;
}

export function buildExamQuestions(
  lessonIds: string[],
  seed: string | number = Date.now(),
  desiredCount = 8
): ExamQuestion[] {
  const lessons = uniqueLessonIds(lessonIds)
    .map((lessonId) => getLesson(lessonId))
    .filter((lesson): lesson is Lesson => Boolean(lesson));

  const questionPool = lessons.flatMap((lesson) =>
    selectQuizQuestions(lesson, `${seed}:${lesson.id}`, 2).map((question, index) => ({
      ...question,
      id: `${lesson.id}_${question.id}`,
      examQuestionId: `${lesson.id}_${question.id}_${index}`,
      lessonId: lesson.id,
      lessonTitle: lesson.title,
    }))
  );

  return shuffle(questionPool, `${seed}:exam`).slice(0, Math.min(desiredCount, questionPool.length));
}

export function completeExamAttempt(
  questions: ExamQuestion[],
  selectedByQuestionId: Record<string, number>
): ExamAttemptResult {
  const grouped = new Map<
    string,
    {
      lesson: Lesson;
      correct: number;
      total: number;
      missedQuestionIds: string[];
    }
  >();

  for (const question of questions) {
    const selected = selectedByQuestionId[question.examQuestionId];
    if (selected === undefined) continue;

    const lesson = getLesson(question.lessonId);
    if (!lesson) continue;

    const group =
      grouped.get(lesson.id) ??
      {
        lesson,
        correct: 0,
        total: 0,
        missedQuestionIds: [],
      };

    group.total += 1;
    if (selected === question.answerIndex) {
      group.correct += 1;
    } else {
      group.missedQuestionIds.push(question.id);
    }
    grouped.set(lesson.id, group);
  }

  const lessonResults = Array.from(grouped.values()).map((group) => ({
    lessonId: group.lesson.id,
    lessonTitle: group.lesson.title,
    correct: group.correct,
    total: group.total,
    result: completeLessonAttempt({
      lesson: group.lesson,
      correct: group.correct,
      total: group.total,
      missedQuestionIds: group.missedQuestionIds,
    }),
  }));

  applyDailyQuestProgress({
    lessonsCompleted: 0,
    xpEarned: 0,
    masteryEvents: 0,
    reviewSessions: lessonResults.length > 0 ? 1 : 0,
    neuroLessonsCompleted: 0,
    mathLessonsCompleted: 0,
  });

  const correct = lessonResults.reduce((sum, item) => sum + item.correct, 0);
  const total = lessonResults.reduce((sum, item) => sum + item.total, 0);
  const newAchievements = Array.from(
    new Set(lessonResults.flatMap((item) => item.result.newAchievements))
  );

  return {
    correct,
    total,
    score: total > 0 ? correct / total : 0,
    xp: lessonResults.reduce((sum, item) => sum + item.result.reward.xp, 0),
    coins: lessonResults.reduce((sum, item) => sum + item.result.reward.coins, 0),
    lessonResults,
    newAchievements,
  };
}
