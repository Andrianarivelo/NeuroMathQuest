import { trackALessons } from '../src/content/trackA';
import { neuroscienceLessonDetails } from '../src/content/neuroscienceLessonDetails';
import { getLesson } from '../src/content/tracks';
import { buildCourseDetails } from '../src/services/lessonContentService';

describe('lessonContentService', () => {
  it('adds richer neuroscience details to every Track A lesson', () => {
    for (const lesson of trackALessons) {
      expect(neuroscienceLessonDetails[lesson.id]).toBeDefined();
      expect(neuroscienceLessonDetails[lesson.id]).toHaveLength(4);
    }
  });

  it('prioritizes neuroscience teaching details before quiz explanations', () => {
    const lesson = getLesson('A01')!;
    const details = buildCourseDetails(lesson);

    expect(details[0]).toMatch(/axon initial segment/i);
    expect(details.length).toBeGreaterThan(lesson.questions.length);
  });

  it('keeps non-neuroscience lessons on their own details', () => {
    const lesson = getLesson('B01')!;
    const details = buildCourseDetails(lesson);

    expect(details.join(' ')).not.toMatch(/axon initial segment/i);
    expect(details.length).toBeGreaterThan(0);
  });

  it('does not add em dashes to the neuroscience lesson details', () => {
    const allDetails = Object.values(neuroscienceLessonDetails).flat().join(' ');
    expect(allDetails).not.toContain('\u2014');
  });
});
