import { getLesson } from '../src/content/tracks';
import { localizeLesson } from '../src/i18n';

describe('localizeContent', () => {
  it('translates lesson concept text in French without changing the lesson id', () => {
    const lesson = getLesson('A01');
    expect(lesson).toBeTruthy();

    const localized = localizeLesson(lesson!, 'fr');

    expect(localized.id).toBe('A01');
    expect(localized.explanation).toContain('Un neurone comporte trois parties');
    expect(localized.explanation).not.toContain('A neuron has three working parts');
  });

  it('keeps notation untouched', () => {
    const lesson = getLesson('A02');
    expect(lesson).toBeTruthy();

    const localized = localizeLesson(lesson!, 'fr');

    expect(localized.notation).toBe(lesson!.notation);
  });
});
