import { Lesson, Module, Track } from './types';
import { trackALessons } from './trackA';
import { trackBLessons } from './trackB';
import { trackCLessons } from './trackC';
import { trackDLessons } from './trackD';
import { trackELessons } from './trackE';

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
    'B-eigen': 'Eigenvalues and decompositions',
    'B-stats': 'Statistics and estimation',
    'B-info': 'Information theory',
    'C-neuron-models': 'Spiking neuron models',
    'C-dendrites': 'Dendrites and cables',
    'C-synaptic': 'Synapses and short-term dynamics',
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
    'C-decision': 'Decision and working memory',
    'C-spatial': 'Spatial codes',
    'C-circuits': 'Microcircuits and modulation',
    'D-foundations': 'AI foundations',
    'D-theory': 'Learning theory',
    'D-models': 'Model families',
    'D-choose': 'Choosing a model',
    'D-build': 'Building and splitting data',
    'D-training': 'Training deep models',
    'D-inference': 'Inference and deployment',
    'D-refining': 'Refining models',
    'E-intro': 'AI meets neuroscience',
    'E-electro': 'Electrophysiology and AI',
    'E-imaging': 'Imaging and computer vision',
    'E-decoding': 'Neural decoding',
    'E-behavior': 'Behaviour and closed-loop AI',
    'E-modeling': 'AI as brain models',
    'E-clinical': 'Clinical applications',
    'E-frontier': 'NeuroAI frontier',
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
    'B-eigen': 'Natural axes, stretching, and low-rank structure.',
    'B-stats': 'Estimating models and uncertainty from data.',
    'B-info': 'Entropy, surprise, and shared information.',
    'C-neuron-models': 'Simple but mighty models of spiking neurons.',
    'C-dendrites': 'How voltage travels through branching neurons.',
    'C-synaptic': 'Conductances, receptors, and short-term synaptic memory.',
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
    'C-decision': 'Accumulating evidence and holding it online.',
    'C-spatial': 'How brains represent location and maps.',
    'C-circuits': 'Layers, cell types, and brain-state control.',
    'D-foundations': 'What AI is and how it learns.',
    'D-theory': 'Loss, bias, variance, and generalisation.',
    'D-models': 'From linear models to transformers.',
    'D-choose': 'Picking the right model for the data.',
    'D-build': 'Splits, leaks, and honest evaluation.',
    'D-training': 'Optimisers, schedules, and stability.',
    'D-inference': 'Running models in the real world.',
    'D-refining': 'Fine-tuning, prompting, and alignment.',
    'E-intro': 'Why AI and neuroscience need each other.',
    'E-electro': 'AI on spikes and probes.',
    'E-imaging': 'Vision models for brain images.',
    'E-decoding': 'From neural activity to behaviour and stimuli.',
    'E-behavior': 'Tracking and shaping behaviour with AI.',
    'E-modeling': 'Networks that resemble cortex.',
    'E-clinical': 'AI in clinics and assistive devices.',
    'E-frontier': 'Foundation models, causality, and ethics.',
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
      'Forty bite-sized lessons on vectors, linear algebra, calculus, probability, statistics, and information theory — framed through neurons.',
    color: '#0A6B4E',
    unlockedByDefault: false,
    modules: buildModules(trackBLessons),
  },
  {
    id: 'compneuro',
    title: 'Computational Neuroscience',
    tagline: 'Where math and biology meet',
    description:
      'Fifty lessons on computational neuroscience — from LIF and Hodgkin-Huxley neurons to synapses, dynamics, decisions, spatial codes, and cortical microcircuits.',
    color: '#8A5A00',
    unlockedByDefault: false,
    modules: buildModules(trackCLessons),
  },
  {
    id: 'aibasis',
    title: 'AI Basics',
    tagline: 'Theory, models, training, refining',
    description:
      'Thirty lessons on modern AI \u2014 from learning theory and model families to training, inference, and fine-tuning.',
    color: '#1F6FEB',
    unlockedByDefault: false,
    modules: buildModules(trackDLessons),
  },
  {
    id: 'aineuro',
    title: 'NeuroAI',
    tagline: 'AI for understanding the brain',
    description:
      'Thirty lessons on AI for neuroscience \u2014 spike sorting, neural decoding, brain models, BCIs, and the NeuroAI frontier.',
    color: '#B82A6E',
    unlockedByDefault: false,
    modules: buildModules(trackELessons),
  },
];

export const allLessons: Lesson[] = [
  ...trackALessons,
  ...trackBLessons,
  ...trackCLessons,
  ...trackDLessons,
  ...trackELessons,
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
