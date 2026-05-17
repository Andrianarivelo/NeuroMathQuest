import { Lesson, Module, QuizQuestion, Track } from '../content/types';
import { AppLanguage, translateText } from './translations';

export function localizeQuizQuestion<T extends QuizQuestion>(
  question: T,
  language: AppLanguage
): T {
  if (language === 'en') return question;
  return {
    ...question,
    prompt: translateText(question.prompt, language),
    options: question.options.map((option) => translateText(option, language)) as T['options'],
    explanation: translateText(question.explanation, language),
  };
}

export function localizeLesson(lesson: Lesson, language: AppLanguage): Lesson {
  if (language === 'en') return lesson;
  return {
    ...lesson,
    title: translateText(lesson.title, language),
    subtitle: translateText(lesson.subtitle, language),
    explanation: translateText(lesson.explanation, language),
    keyTerms: lesson.keyTerms.map((term) => translateText(term, language)),
    example: translateText(lesson.example, language),
    intuition: translateText(lesson.intuition, language),
    whyItMatters: translateText(lesson.whyItMatters, language),
    notationTerms: lesson.notationTerms?.map((term) => ({
      ...term,
      meaning: translateText(term.meaning, language),
    })),
    questions: lesson.questions.map((question) =>
      localizeQuizQuestion(question, language)
    ) as Lesson['questions'],
  };
}

export function localizeModule(module: Module, language: AppLanguage): Module {
  if (language === 'en') return module;
  return {
    ...module,
    title: translateText(module.title, language),
    description: translateText(module.description, language),
  };
}

export function localizeTrack(track: Track, language: AppLanguage): Track {
  if (language === 'en') return track;
  return {
    ...track,
    title: translateText(track.title, language),
    tagline: translateText(track.tagline, language),
    description: translateText(track.description, language),
    modules: track.modules.map((module) => localizeModule(module, language)),
  };
}
