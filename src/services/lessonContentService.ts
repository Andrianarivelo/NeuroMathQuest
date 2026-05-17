import { getNotationTerms } from '../content/notationTerms';
import { neuroscienceLessonDetails } from '../content/neuroscienceLessonDetails';
import { Lesson } from '../content/types';
import { AppLanguage, translateText } from '../i18n';

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

export function buildCourseDetails(lesson: Lesson, language: AppLanguage = 'en'): string[] {
  return uniqueDetails([
    ...(neuroscienceLessonDetails[lesson.id] ?? []).map((detail) => translateText(detail, language)),
    ...lesson.questions.map((question) => translateText(question.explanation, language)),
    ...getNotationTerms(lesson).map((term) =>
      language === 'fr'
        ? `${term.symbol} signifie ${translateText(term.meaning, language)}.`
        : `${term.symbol} means ${term.meaning}.`
    ),
  ]).slice(0, lesson.trackId === 'neuroscience' ? 8 : 6);
}
