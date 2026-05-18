import { allLessons, getLesson } from '../src/content/tracks';
import { localizeLesson, translateText } from '../src/i18n';
import { Lesson } from '../src/content/types';
import { buildCourseDetails } from '../src/services/lessonContentService';

function lessonText(lesson: Lesson): string {
  const parts = [
    lesson.title,
    lesson.subtitle,
    lesson.explanation,
    lesson.example,
    lesson.intuition,
    lesson.whyItMatters,
    ...lesson.keyTerms,
    ...(lesson.notationTerms ?? []).flatMap((term) => [term.symbol, term.meaning]),
    ...lesson.questions.flatMap((question) => [
      question.prompt,
      question.explanation,
      ...question.options,
    ]),
  ];
  return parts.join('\n');
}

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

    expect(localized.whyItMatters).toContain('Sans indices clairs');
    expect(localized.whyItMatters).not.toContain('Without comfortable indexing');
  });

  it('uses curated scientific French instead of literal machine terminology', () => {
    const localizedText = allLessons
      .map((lesson) => [
        lessonText(localizeLesson(lesson, 'fr')),
        ...buildCourseDetails(lesson, 'fr'),
      ].join('\n'))
      .join('\n');

    expect(localizedText).not.toMatch(/cadence de tir|cadence de déclenchement|cuisson/i);
    expect(localizedText).not.toMatch(/fonctionnalit|orthographes|mappant|intrants?/i);
    expect(localizedText).not.toMatch(/(^|\s)(un|Un) avion(\s|$)/);
    expect(localizedText).not.toMatch(/Potentiels d'action du feu/i);
    expect(localizedText).not.toMatch(/\bpointes?\b/i);
    expect(localizedText).not.toMatch(/\bpics?\b/i);
    expect(localizedText).not.toMatch(/rythme doux/i);
    expect(localizedText).not.toMatch(/(^|[^A-Za-zÀ-ÖØ-öø-ÿ])(émetteurs?|transmetteurs?|trieurs?|intégrations)([^A-Za-zÀ-ÖØ-öø-ÿ]|$)/i);
    expect(localizedText).not.toMatch(/la potentiel d'action|une potentiel d'action/i);
    expect(localizedText).not.toMatch(/Spike binaire|flux de réaction|Signal GRAS/i);

    expect(localizeLesson(getLesson('A04')!, 'fr').whyItMatters).toContain("potentiels d'action");
    expect(localizeLesson(getLesson('B11')!, 'fr').explanation).toContain('Σᵢ wᵢ xᵢ');
    expect(localizeLesson(getLesson('C01')!, 'fr').explanation).toContain('neurone intégrateur à fuite');
  });

  it('polishes literal French fragments before they reach the UI', () => {
    expect(translateText('pics synaptiques', 'fr')).toBe('événements synaptiques');
    expect(translateText('Ion pumps use ATP to restore gradients after synaptic currents and spikes.', 'fr'))
      .toContain("courants synaptiques et potentiels d'action");
    expect(translateText('A peak in the spectrum reveals a rhythmic component.', 'fr'))
      .toBe('Un maximum spectral révèle une composante rythmique.');
    expect(translateText('Current streak: 2 days. Keep the rhythm gentle and steady.', 'fr'))
      .toBe('Série actuelle : 2 jours. Continue régulièrement, à ton rythme.');
  });
});
