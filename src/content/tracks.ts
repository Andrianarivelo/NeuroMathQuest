import { Lesson, Module, Track } from './types';
import { trackALessons } from './trackA';
import { trackBLessons } from './trackB';
import { trackCLessons } from './trackC';

function buildModules(lessons: Lesson[]): Module[] {
  const map = new Map<string, Module>();
  for (const l of lessons) {
    const mod = map.get(l.moduleId) ?? {
      id: l.moduleId,
      trackId: l.trackId,
      title: titleFromModuleId(l.moduleId),
      description: descriptionFromModuleId(l.moduleId),
      lessonIds: [],
    };
    mod.lessonIds.push(l.id);
    map.set(l.moduleId, mod);
  }
  return Array.from(map.values());
}

function titleFromModuleId(id: string): string {
  const titles: Record<string, string> = {
    'A-cells': 'Cells of the brain',
    'A-membrane': 'Membranes and currents',
    'A-spikes': 'Action potentials',
    'A-synapses': 'Synapses and transmitters',
    'A-support': 'Support cells',
    'A-systems': 'Sensory and motor systems',
    'A-cortex': 'Cortex and thalamus',
    'A-subcort': 'Subcortical circuits',
    'A-memory': 'Memory and emotion',
    'A-cognition': 'Attention and rhythms',
    'A-methods': 'Modern methods',
    'B-numbers': 'Numbers and vectors',
    'B-notation': 'Reading notation',
    'B-spaces': 'Vector spaces',
    'B-matrices': 'Matrices and circuits',
    'B-functions': 'Functions',
    'B-calculus': 'Rates of change',
    'B-dynamics': 'State and dynamics',
    'B-prob': 'Probability basics',
    'C-neuron-models': 'Spiking neuron models',
    'C-rate': 'Rate models',
    'C-coding': 'Coding and decoding',
    'C-bayes': 'Bayesian reasoning',
    'C-stats': 'Neural statistics',
    'C-processes': 'Stochastic processes',
    'C-plasticity': 'Plasticity and learning',
    'C-attractors': 'Attractor dynamics',
    'C-rhythms': 'Rhythms and spectra',
    'C-filters': 'Filters and convolution',
    'C-glms': 'Statistical models',
    'C-dimred': 'Dimensionality and manifolds',
    'C-rl': 'Reinforcement learning',
    'C-predictive': 'Predictive coding',
    'C-efficient': 'Efficient coding',
    'C-bci': 'Neural interfaces',
  };
  return titles[id] ?? id;
}

function descriptionFromModuleId(id: string): string {
  const descriptions: Record<string, string> = {
    'A-cells': 'The basic shapes that make up a thinking brain.',
    'A-membrane': 'Why a neuron is a tiny, quiet battery.',
    'A-spikes': 'The spark that turns charge into a message.',
    'A-synapses': 'How neurons pass information to each other.',
    'A-support': 'Cells that keep neurons running.',
    'A-systems': 'How senses and movement are organised.',
    'A-cortex': 'Layered sheets and central relays.',
    'A-subcort': 'Deep nuclei that choose actions and fine-tune them.',
    'A-memory': 'Binding time, place, and meaning.',
    'A-cognition': 'Attention, control, and brain rhythms.',
    'A-methods': 'How modern neuroscience actually looks inside.',
    'B-numbers': 'Scalars, vectors, and the language of many numbers.',
    'B-notation': 'Reading subscripts and time-varying signals.',
    'B-spaces': 'Where vectors live.',
    'B-matrices': 'Grids of numbers that wire up neurons.',
    'B-functions': 'Inputs in, outputs out.',
    'B-calculus': 'How quantities change over time.',
    'B-dynamics': 'State and state space.',
    'B-prob': 'Random variables and their behaviour.',
    'C-neuron-models': 'Simple but mighty models of spiking neurons.',
    'C-rate': 'Smooth descriptions of population activity.',
    'C-coding': 'Tuning curves, population codes, and decoding.',
    'C-bayes': 'Combining priors and evidence.',
    'C-stats': 'Correlations and co-variability.',
    'C-processes': 'Markov chains and spike processes.',
    'C-plasticity': 'Learning rules that change synapses.',
    'C-attractors': 'Networks that settle into stable states.',
    'C-rhythms': 'Oscillations and frequency analysis.',
    'C-filters': 'Convolution and linear models.',
    'C-glms': 'Statistical models for real spike data.',
    'C-dimred': 'Low-dimensional structure in populations.',
    'C-rl': 'Learning from reward and error.',
    'C-predictive': 'Predictions, errors, and hierarchies.',
    'C-efficient': 'Using every spike wisely.',
    'C-bci': 'Reading brains and moving the world.',
  };
  return descriptions[id] ?? '';
}

export const tracks: Track[] = [
  {
    id: 'neuroscience',
    title: 'Neuroscience Basics',
    tagline: 'The brain, clearly and kindly',
    description:
      'Twenty short lessons on how real brains are built and how they work. Unlocked from day one.',
    color: '#4530B8',
    unlockedByDefault: true,
    modules: buildModules(trackALessons),
  },
  {
    id: 'math',
    title: 'Math Foundations',
    tagline: 'The math that compneuro actually uses',
    description:
      'Twenty bite-sized lessons on vectors, matrices, dynamics, and probability \u2014 framed through neurons.',
    color: '#0A6B4E',
    unlockedByDefault: false,
    modules: buildModules(trackBLessons),
  },
  {
    id: 'compneuro',
    title: 'Computational Neuroscience',
    tagline: 'Where math and biology meet',
    description:
      'Thirty lessons on modern computational neuroscience \u2014 from LIF neurons to predictive coding and BCIs.',
    color: '#8A5A00',
    unlockedByDefault: false,
    modules: buildModules(trackCLessons),
  },
];

export const allLessons: Lesson[] = [
  ...trackALessons,
  ...trackBLessons,
  ...trackCLessons,
];

export const lessonsById: Record<string, Lesson> = Object.fromEntries(
  allLessons.map((l) => [l.id, l])
);

export function getLesson(id: string): Lesson | undefined {
  return lessonsById[id];
}

export function getTrack(id: string): Track | undefined {
  return tracks.find((t) => t.id === id);
}

export function getTrackLessons(trackId: string): Lesson[] {
  return allLessons.filter((l) => l.trackId === trackId).sort((a, b) => a.order - b.order);
}
