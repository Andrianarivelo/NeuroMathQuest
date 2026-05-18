import { allLessons, getLesson, tracks } from '../src/content/tracks';
import { localizeLesson, localizeTrack, translateText } from '../src/i18n';
import { Lesson } from '../src/content/types';
import { buildCourseDetails } from '../src/services/lessonContentService';
import { encouragementCopy } from '../src/content/encouragement';

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

function trackText(): string {
  return tracks
    .map((track) => {
      const localized = localizeTrack(track, 'fr');
      return [
        localized.title,
        localized.tagline,
        localized.description,
        ...localized.modules.flatMap((module) => [module.title, module.description]),
      ].join('\n');
    })
    .join('\n');
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
      .concat(trackText())
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
    expect(localizedText).not.toMatch(/colonne vertébrale|post-synaptique|pré-synaptique/i);
    expect(localizedText).not.toMatch(/se soucie|score cérébral|proxy|proxys|itinéraires de traitement/i);
    expect(localizedText).not.toMatch(/coups de pouce|modèles comme attracteurs|patrons de décharge/i);
    expect(localizedText).not.toMatch(/gentiment|déclencher le décharge|marchandises|feuille 2D peut mettre en œuvre/i);
    expect(localizedText).not.toMatch(/Modèles tarifaires|antécédents|Fissures|NeuroIA|appareils fonctionnels/i);
    expect(localizedText).not.toMatch(/Ajustement, invite|Familles modèles|Notation de lecture/i);
    expect(localizedText).not.toMatch(/rêver les données|Remuez une partie|interventions sont déconcertantes|corrélation pure/i);

    expect(localizeLesson(getLesson('A04')!, 'fr').whyItMatters).toContain("potentiels d'action");
    expect(localizeLesson(getLesson('A21')!, 'fr').explanation).toContain('épines dendritiques');
    expect(localizeLesson(getLesson('A23')!, 'fr').explanation).toContain('cargaisons');
    expect(localizeLesson(getLesson('B11')!, 'fr').explanation).toContain('Σᵢ wᵢ xᵢ');
    expect(localizeLesson(getLesson('C01')!, 'fr').explanation).toContain('neurone intégrateur à fuite');
    expect(localizeLesson(getLesson('E18')!, 'fr').title).toContain('Brain-Score');
    expect(localizeTrack(tracks[0], 'fr').tagline).toBe('Le cerveau, simplement et clairement');
    expect(localizeTrack(tracks[2], 'fr').modules.find((module) => module.id === 'C-rate')?.title)
      .toBe('Modèles de fréquence de décharge');
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

  it('uses natural French for quiz UI and encouragement copy', () => {
    const quizUiStrings = [
      'Perfect!',
      'Well done',
      'Good effort',
      'Good learning moment',
      'Perfect score bonus!',
      'Mastery bonus unlocked!',
      'Milestone chest unlocked!',
      'Try again',
      'See results',
      '3/3 correct',
      'Achievement: ach_test',
      'No quiz questions available for this lesson yet.',
    ];

    const localizedText = [
      ...quizUiStrings.map((text) => translateText(text, 'fr')),
      ...Object.values(encouragementCopy).flat().map((text) => translateText(text, 'fr')),
    ].join('\n');

    expect(translateText('You own this one now.', 'fr')).toBe('Ce concept est maintenant solide.');
    expect(translateText('3/3 correct', 'fr')).toBe('3/3 bonnes réponses');
    expect(localizedText).not.toMatch(/appartient maintenant|vous appartient|dans les livres/i);
    expect(localizedText).not.toMatch(/strie|butin|tout le truc|vous êtes apparu|Joliment raisonné/i);
    expect(localizedText).not.toMatch(/rythme devient plus facile|Ce genre de journée s'additionne/i);
  });
});
