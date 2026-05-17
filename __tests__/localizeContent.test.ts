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

  it('does not leave English context around means sentences', () => {
    const lesson = getLesson('A24');
    expect(lesson).toBeTruthy();

    const localized = localizeLesson(lesson!, 'fr');

    expect(localized.explanation).toContain('La plasticité synaptique signifie');
    expect(localized.explanation).not.toContain('Synaptic plasticity means');
  });

  it('translates short prompts that include notation', () => {
    const lesson = getLesson('B05');
    expect(lesson).toBeTruthy();

    const localized = localizeLesson(lesson!, 'fr');

    expect(localized.questions[0].prompt).toBe('xᵢ avec i = 4 signifie...');
  });

  it('overrides mixed machine translations that left English fragments', () => {
    const lesson = getLesson('B03');
    expect(lesson).toBeTruthy();

    const localized = localizeLesson(lesson!, 'fr');

    expect(localized.whyItMatters).toContain('Sans une lecture confortable des indices');
    expect(localized.whyItMatters).not.toContain('Without comfortable indexing');
  });
});
