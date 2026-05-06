import { getNotationTerms } from '../content/notationTerms';
import { neuroscienceLessonDetails } from '../content/neuroscienceLessonDetails';
import { Lesson } from '../content/types';

function uniqueDetails(values: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values.map((item) => item.trim()).filter(Boolean)) {
    const key = value.toLocaleLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(value);
  }
  return result;
}

export function buildCourseDetails(lesson: Lesson): string[] {
  return uniqueDetails([
    ...(neuroscienceLessonDetails[lesson.id] ?? []),
    ...lesson.questions.map((question) => question.explanation),
    ...getNotationTerms(lesson).map((term) => `${term.symbol} means ${term.meaning}.`),
  ]).slice(0, lesson.trackId === 'neuroscience' ? 8 : 6);
}
