import { Lesson } from './types';

/**
 * Track A - Neuroscience Basics. 40 lessons. Unlocked from the start.
 */
export const trackALessons: Lesson[] = [
  {
    id: 'A01',
    trackId: 'neuroscience',
    moduleId: 'A-cells',
    order: 1,
    title: 'Neuron anatomy',
    subtitle: 'The shape of a thinking cell',
    estimatedMinutes: 4,
    difficulty: 'intro',
    prerequisites: [],
    explanation:
      'A neuron has three working parts. Dendrites reach out like branches to catch incoming signals. The cell body, called the soma, gathers these signals and decides whether to respond. A long cable called the axon carries the neuron\u2019s own signal to other cells, often ending at specialised tips called axon terminals.',
    notation: 'dendrites \u2192 soma \u2192 axon \u2192 terminals',
    keyTerms: ['dendrite', 'soma', 'axon', 'axon terminal'],
    example:
      'A pyramidal neuron in your cortex can have a dendritic tree the size of a coin and an axon that travels a dozen centimetres to speak with a distant brain region.',
    intuition: 'Input in, signal out. The neuron is a tiny messenger with branches to listen and a wire to speak.',
    whyItMatters:
      'Every model you will meet later is a simplification of this shape. Knowing the parts lets you connect equations to real biology.',
    questions: [
      {
        prompt: 'Which part of a neuron mainly receives incoming signals?',
        options: ['Axon', 'Dendrites', 'Myelin', 'Synaptic vesicles'],
        answerIndex: 1,
        explanation: 'Dendrites branch outward to collect inputs from other neurons.',
      },
      {
        prompt: 'The axon is best described as...',
        options: [
          'The cell\u2019s input tree',
          'The decision-making core',
          'A cable that carries the cell\u2019s output',
          'A type of supporting glial cell',
        ],
        answerIndex: 2,
        explanation: 'The axon carries a neuron\u2019s outgoing signal, often far from the soma.',
      },
      {
        prompt: 'The soma is also called the...',
        options: ['Synapse', 'Cell body', 'Node of Ranvier', 'Dendritic spine'],
        answerIndex: 1,
        explanation: 'Soma simply means "body". It houses the nucleus and integrates signals.',
      },
    ],
    xpReward: 15,
    coinReward: 5,
    masteryThreshold: 0.8,
  },
  {
    id: 'A02',
    trackId: 'neuroscience',
    moduleId: 'A-membrane',
    order: 2,
    title: 'Resting membrane potential',
    subtitle: 'Why a quiet neuron is not zero',
    estimatedMinutes: 5,
    difficulty: 'beginner',
    prerequisites: ['A01'],
    explanation:
      'A neuron at rest holds a small voltage across its membrane, typically around minus 65 millivolts inside relative to outside. This difference exists because potassium can leak out while sodium is kept mostly outside, and negatively charged proteins sit inside the cell.',
    notation: 'V_rest \u2248 \u221265 mV',
    keyTerms: ['membrane potential', 'ion gradient', 'K+ leak', 'Na+/K+ pump'],
    example:
      'Cortical neurons are not silent at rest - they sit negatively charged and ready, like a tiny battery waiting for a reason to fire.',
    intuition: 'Rest is not off. Rest is a charged silence.',
    whyItMatters:
      'Every spike begins from rest. Computational models start with a resting state and ask how inputs push it toward threshold.',
    questions: [
      {
        prompt: 'A typical resting membrane potential is approximately...',
        options: ['+30 mV', '0 mV', '\u221265 mV', '\u2212150 mV'],
        answerIndex: 2,
        explanation: 'Most neurons rest near \u221265 mV, a small negative voltage relative to outside.',
      },
      {
        prompt: 'Resting potential is maintained mainly because...',
        options: [
          'Ion concentrations inside and outside are equal',
          'K+ leaks out and negative proteins stay in',
          'The cell is electrically insulated',
          'Sodium floods in constantly',
        ],
        answerIndex: 1,
        explanation: 'Potassium leak plus trapped anions produce the small negative interior.',
      },
      {
        prompt: 'The Na+/K+ pump uses energy to...',
        options: [
          'Open voltage-gated sodium channels',
          'Move Na+ out and K+ in against their gradients',
          'Fire action potentials',
          'Release neurotransmitters',
        ],
        answerIndex: 1,
        explanation: 'The pump trades three Na+ out for two K+ in, maintaining the gradients that make resting potential possible.',
      },
    ],
    xpReward: 18,
    coinReward: 6,
    masteryThreshold: 0.8,
  },
  {
    id: 'A03',
    trackId: 'neuroscience',
    moduleId: 'A-membrane',
    order: 3,
    title: 'Ion channels and membrane currents',
    subtitle: 'The gates that shape every signal',
    estimatedMinutes: 5,
    difficulty: 'beginner',
    prerequisites: ['A02'],
    explanation:
      'Ion channels are proteins that span the membrane and let specific ions pass. Some are always open. Many open in response to voltage changes or chemical signals. When open, they produce a tiny electrical current that nudges the membrane potential.',
    notation: 'I = g (V \u2212 E)',
    keyTerms: ['ion channel', 'conductance', 'reversal potential', 'gating'],
    example:
      'Voltage-gated sodium channels are the spark plugs of the action potential - they snap open when the membrane depolarises past threshold.',
    intuition: 'Channels are tiny doors. Opening a door lets charge flow and pushes the voltage.',
    whyItMatters:
      'Every formal neuron model talks about conductances. If you can read I = g times (V \u2212 E), you can read most of them.',
    questions: [
      {
        prompt: 'In I = g (V \u2212 E), what does E represent?',
        options: ['Total current', 'The reversal potential of the channel', 'Membrane capacitance', 'Resting input'],
        answerIndex: 1,
        explanation: 'E is the reversal potential, the voltage at which no net current flows through that channel.',
      },
      {
        prompt: 'A voltage-gated channel changes its open probability because of...',
        options: ['Light', 'Local voltage changes', 'Temperature alone', 'Gravity'],
        answerIndex: 1,
        explanation: 'Voltage-gated channels sense the membrane potential and open or close accordingly.',
      },
      {
        prompt: 'Higher conductance g, with everything else equal, means...',
        options: ['Less current flows', 'More current flows', 'The reversal potential shifts', 'The channel reverses direction'],
        answerIndex: 1,
        explanation: 'Current scales linearly with conductance for a fixed driving force.',
      },
    ],
    xpReward: 20,
    coinReward: 7,
    masteryThreshold: 0.8,
  },
  {
    id: 'A04',
    trackId: 'neuroscience',
    moduleId: 'A-spikes',
    order: 4,
    title: 'Action potentials',
    subtitle: 'The all-or-none spike',
    estimatedMinutes: 5,
    difficulty: 'beginner',
    prerequisites: ['A03'],
    explanation:
      'An action potential is a short, stereotyped voltage burst. Once the membrane crosses threshold, voltage-gated sodium channels open and the interior flips positive. Potassium channels then open and the voltage returns, even overshooting briefly before settling.',
    keyTerms: ['threshold', 'depolarisation', 'repolarisation', 'refractory period'],
    example:
      'A single cortical neuron may spike only a few times per second on average, but each spike is a crisp, all-or-none event lasting about a millisecond.',
    intuition: 'Below threshold, nothing. Above threshold, a full reliable pulse.',
    whyItMatters:
      'Neurons talk in spikes. Modelling spikes lets us study how information hops between cells in real time.',
    questions: [
      {
        prompt: 'Action potentials are usually described as...',
        options: ['Graded', 'All-or-none', 'Slow-wave', 'Continuous'],
        answerIndex: 1,
        explanation: 'Either threshold is crossed and a full spike fires, or nothing happens.',
      },
      {
        prompt: 'Depolarisation during a spike is driven mainly by...',
        options: ['Potassium efflux', 'Calcium influx', 'Sodium influx', 'Chloride efflux'],
        answerIndex: 2,
        explanation: 'Voltage-gated sodium channels open, and Na+ rushes in, flipping the membrane briefly positive.',
      },
      {
        prompt: 'The refractory period ensures that...',
        options: [
          'Spikes repeat rapidly and without limit',
          'Spikes travel backwards',
          'A second spike cannot immediately follow the first',
          'All spikes have equal amplitude forever',
        ],
        answerIndex: 2,
        explanation: 'After a spike, the cell cannot immediately fire again, enforcing a maximum firing rate.',
      },
    ],
    xpReward: 20,
    coinReward: 7,
    masteryThreshold: 0.8,
  },
  {
    id: 'A05',
    trackId: 'neuroscience',
    moduleId: 'A-synapses',
    order: 5,
    title: 'Chemical synapses',
    subtitle: 'How neurons pass the message',
    estimatedMinutes: 5,
    difficulty: 'beginner',
    prerequisites: ['A04'],
    explanation:
      'When a spike arrives at an axon terminal, calcium enters and vesicles fuse with the membrane, releasing neurotransmitter into a narrow gap. The molecules bind to receptors on the receiving cell and briefly change its membrane conductance, nudging it toward or away from firing.',
    keyTerms: ['vesicle', 'neurotransmitter', 'receptor', 'synaptic cleft'],
    example:
      'At a hippocampal synapse, a spike can release glutamate in under a millisecond, producing a tiny postsynaptic response just a few millivolts high.',
    intuition: 'Electric becomes chemical becomes electric again - a three-step handoff.',
    whyItMatters:
      'Synapses are where learning happens. Most models of learning are rules that change synaptic strength.',
    questions: [
      {
        prompt: 'What ion triggers neurotransmitter release at the terminal?',
        options: ['Sodium', 'Chloride', 'Calcium', 'Magnesium'],
        answerIndex: 2,
        explanation: 'Calcium enters through voltage-gated channels and triggers vesicle fusion.',
      },
      {
        prompt: 'Chemical synaptic transmission uses...',
        options: [
          'Direct ion flow between cells',
          'Magnetic fields',
          'Release of neurotransmitter across a small gap',
          'Vibration of the membrane',
        ],
        answerIndex: 2,
        explanation: 'Neurotransmitter diffuses across the synaptic cleft to receptors on the next cell.',
      },
      {
        prompt: 'A postsynaptic receptor typically...',
        options: [
          'Ignores the chemical signal',
          'Opens an ion channel or triggers a signalling cascade',
          'Fires its own action potential',
          'Releases neurotransmitter itself',
        ],
        answerIndex: 1,
        explanation: 'Binding opens ligand-gated channels or activates intracellular messengers.',
      },
    ],
    xpReward: 22,
    coinReward: 8,
    masteryThreshold: 0.8,
  },
  {
    id: 'A06',
    trackId: 'neuroscience',
    moduleId: 'A-synapses',
    order: 6,
    title: 'Excitatory vs inhibitory transmission',
    subtitle: 'Push the spike, pull it back',
    estimatedMinutes: 4,
    difficulty: 'beginner',
    prerequisites: ['A05'],
    explanation:
      'Excitatory synapses push the receiving neuron closer to its firing threshold. Inhibitory synapses push it further away. Most of the balance in a cortical microcircuit is maintained by a mix of both acting on the same cells.',
    keyTerms: ['EPSP', 'IPSP', 'balance', 'glutamate', 'GABA'],
    example:
      'In the cortex, pyramidal cells release glutamate (excitatory) while interneurons release GABA (inhibitory), creating fast gate-keeping dynamics.',
    intuition: 'Every neuron lives with an accelerator and a brake on the same pedal.',
    whyItMatters:
      'Excitation-inhibition balance appears in many models of stability, timing, and decision-making.',
    questions: [
      {
        prompt: 'An EPSP moves the membrane potential...',
        options: ['More negative', 'Toward threshold', 'Away from threshold', 'Nowhere'],
        answerIndex: 1,
        explanation: 'An excitatory postsynaptic potential depolarises the cell, pushing it toward firing.',
      },
      {
        prompt: 'The main excitatory transmitter in cortex is...',
        options: ['GABA', 'Glutamate', 'Dopamine', 'Acetylcholine'],
        answerIndex: 1,
        explanation: 'Glutamate is the dominant excitatory transmitter in the vertebrate CNS.',
      },
      {
        prompt: 'GABA usually has a(n)...',
        options: ['Excitatory role', 'No effect', 'Inhibitory role', 'Delayed excitatory role only'],
        answerIndex: 2,
        explanation: 'GABA opens chloride channels, hyperpolarising or shunting most mature neurons.',
      },
    ],
    xpReward: 20,
    coinReward: 7,
    masteryThreshold: 0.8,
  },
  {
    id: 'A07',
    trackId: 'neuroscience',
    moduleId: 'A-synapses',
    order: 7,
    title: 'Neurotransmitters',
    subtitle: 'A small vocabulary of chemical words',
    estimatedMinutes: 4,
    difficulty: 'beginner',
    prerequisites: ['A06'],
    explanation:
      'Neurotransmitters are the chemicals neurons use to talk. A few are fast and point-to-point, like glutamate and GABA. Others act more broadly, tuning circuits - dopamine, serotonin, norepinephrine, and acetylcholine.',
    keyTerms: ['glutamate', 'GABA', 'dopamine', 'serotonin', 'acetylcholine'],
    example:
      'Dopamine neurons in the midbrain fire briefly when a reward is better than expected, helping the brain update its predictions.',
    intuition: 'Some transmitters send a message. Others set the mood.',
    whyItMatters:
      'Models of reward learning, attention, and motivation depend on these neuromodulators.',
    questions: [
      {
        prompt: 'Which transmitter is most associated with reward prediction error?',
        options: ['GABA', 'Glutamate', 'Dopamine', 'Histamine'],
        answerIndex: 2,
        explanation: 'Midbrain dopamine neurons carry signals closely related to reward prediction error.',
      },
      {
        prompt: 'Fast point-to-point excitation in cortex uses mostly...',
        options: ['Serotonin', 'Glutamate', 'Noradrenaline', 'Oxytocin'],
        answerIndex: 1,
        explanation: 'Glutamate mediates the majority of fast excitatory transmission.',
      },
      {
        prompt: 'Neuromodulators like serotonin or noradrenaline typically...',
        options: [
          'Act instantly and point-to-point',
          'Change circuit-wide excitability on slower timescales',
          'Produce action potentials directly',
          'Ignore postsynaptic receptors',
        ],
        answerIndex: 1,
        explanation: 'Neuromodulators adjust how circuits respond on slower, broader timescales.',
      },
    ],
    xpReward: 20,
    coinReward: 7,
    masteryThreshold: 0.8,
  },
  {
    id: 'A08',
    trackId: 'neuroscience',
    moduleId: 'A-synapses',
    order: 8,
    title: 'Receptors and neuromodulation',
    subtitle: 'Tuning the conversation',
    estimatedMinutes: 4,
    difficulty: 'beginner',
    prerequisites: ['A07'],
    explanation:
      'Receptors come in two main flavours. Ionotropic receptors are themselves ion channels and react in milliseconds. Metabotropic receptors trigger internal signalling cascades and act over seconds to minutes. Neuromodulators usually use the slower kind to shape how neurons respond to their inputs.',
    keyTerms: ['ionotropic', 'metabotropic', 'G-protein', 'gain control'],
    example:
      'During focused attention, acetylcholine can boost how strongly cortical neurons respond to the same input - a gain-like effect.',
    intuition: 'Fast gates send signals. Slow cascades change how signals are heard.',
    whyItMatters:
      'Gain and modulation are central ideas in many computational models of attention and context.',
    questions: [
      {
        prompt: 'Ionotropic receptors act on the order of...',
        options: ['Milliseconds', 'Minutes', 'Hours', 'Days'],
        answerIndex: 0,
        explanation: 'They are ion channels themselves and respond within milliseconds.',
      },
      {
        prompt: 'Metabotropic receptors usually...',
        options: [
          'Open instantly',
          'Activate G-proteins and internal cascades',
          'Do not affect cells',
          'Are found only in glia',
        ],
        answerIndex: 1,
        explanation: 'They act through intracellular signalling, producing slower but longer-lasting effects.',
      },
      {
        prompt: 'Neuromodulation mostly changes...',
        options: [
          'Which neurons exist',
          'How neurons respond to inputs they receive',
          'The shape of the skull',
          'The number of synapses in one second',
        ],
        answerIndex: 1,
        explanation: 'Modulators tune gain, excitability, and plasticity rather than carry fast messages.',
      },
    ],
    xpReward: 20,
    coinReward: 7,
    masteryThreshold: 0.8,
  },
  {
    id: 'A09',
    trackId: 'neuroscience',
    moduleId: 'A-support',
    order: 9,
    title: 'Glia and support cells',
    subtitle: 'The other half of the brain',
    estimatedMinutes: 4,
    difficulty: 'beginner',
    prerequisites: ['A01'],
    explanation:
      'Glial cells outnumber neurons in many brain regions. Astrocytes regulate ions and neurotransmitters around synapses. Oligodendrocytes and Schwann cells wrap axons in myelin. Microglia patrol for damage and prune unused connections.',
    keyTerms: ['astrocyte', 'oligodendrocyte', 'microglia', 'myelin'],
    example:
      'Myelinated axons in white matter can conduct spikes many times faster than unmyelinated ones, letting distant brain regions coordinate on millisecond timescales.',
    intuition: 'Glia are not passive. They shape the conditions in which neurons compute.',
    whyItMatters:
      'Models of signal speed, energy, and synaptic reliability depend on glial support.',
    questions: [
      {
        prompt: 'Myelin is produced in the central nervous system by...',
        options: ['Astrocytes', 'Oligodendrocytes', 'Schwann cells', 'Microglia'],
        answerIndex: 1,
        explanation: 'Oligodendrocytes wrap multiple CNS axons in myelin; Schwann cells do so in the peripheral nervous system.',
      },
      {
        prompt: 'Which glial cells prune synapses and respond to damage?',
        options: ['Astrocytes', 'Microglia', 'Schwann cells', 'Neurons'],
        answerIndex: 1,
        explanation: 'Microglia are the brain\u2019s resident immune cells and help sculpt circuits.',
      },
      {
        prompt: 'Astrocytes help by...',
        options: [
          'Firing action potentials at high rates',
          'Regulating ions and transmitters around synapses',
          'Producing cerebrospinal fluid alone',
          'Storing long-term memories',
        ],
        answerIndex: 1,
        explanation: 'Astrocytes buffer ions and recycle transmitters so synapses stay reliable.',
      },
    ],
    xpReward: 18,
    coinReward: 6,
    masteryThreshold: 0.8,
  },
  {
    id: 'A10',
    trackId: 'neuroscience',
    moduleId: 'A-systems',
    order: 10,
    title: 'Sensory systems and receptive fields',
    subtitle: 'What does this neuron care about?',
    estimatedMinutes: 5,
    difficulty: 'beginner',
    prerequisites: ['A04'],
    explanation:
      'A sensory neuron\u2019s receptive field is the region of the world where a stimulus changes its firing rate. In vision it is a patch on the retina. In touch it is a patch of skin. In audition it is a range of frequencies.',
    keyTerms: ['receptive field', 'feature', 'preferred stimulus', 'tuning'],
    example:
      'A V1 neuron in the primary visual cortex often responds best to a bar at a specific orientation in a specific small part of the visual field.',
    intuition: 'Every sensory neuron asks one tiny question and answers with its firing rate.',
    whyItMatters:
      'Receptive fields are the bridge between physical stimuli and neural computation.',
    questions: [
      {
        prompt: 'A receptive field is best described as...',
        options: [
          'A type of synapse',
          'The stimulus region that changes a neuron\u2019s firing',
          'The voltage at which a spike fires',
          'A sensory organ',
        ],
        answerIndex: 1,
        explanation: 'It is the subset of the stimulus space to which a neuron is sensitive.',
      },
      {
        prompt: 'V1 neurons often respond to...',
        options: ['Faces only', 'Oriented edges', 'Words only', 'Pure red colour'],
        answerIndex: 1,
        explanation: 'Many V1 cells are orientation-tuned, a foundational result of visual neuroscience.',
      },
      {
        prompt: 'The preferred stimulus of a neuron is...',
        options: [
          'One that produces no response',
          'One that maximises its firing',
          'The one it can inhibit',
          'The first stimulus it ever saw',
        ],
        answerIndex: 1,
        explanation: 'Its preferred stimulus is the one that drives the highest firing rate.',
      },
    ],
    xpReward: 22,
    coinReward: 8,
    masteryThreshold: 0.8,
  },
  {
    id: 'A11',
    trackId: 'neuroscience',
    moduleId: 'A-systems',
    order: 11,
    title: 'Motor systems',
    subtitle: 'From intention to movement',
    estimatedMinutes: 5,
    difficulty: 'beginner',
    prerequisites: ['A10'],
    explanation:
      'Motor neurons in the spinal cord drive muscles directly, while motor cortex, cerebellum, and basal ganglia plan and refine movement. The final common path is always the motor neuron, whose firing rate sets muscle force.',
    keyTerms: ['motor neuron', 'motor unit', 'motor cortex', 'final common path'],
    example:
      'When you reach for a cup, cortical areas plan the trajectory while spinal motor neurons actually command your arm muscles.',
    intuition: 'Thought becomes action only through the spikes of a motor neuron.',
    whyItMatters:
      'Models of control and motor learning depend on understanding this pipeline.',
    questions: [
      {
        prompt: 'The "final common path" for motor output is the...',
        options: ['Thalamus', 'Spinal motor neuron', 'Hippocampus', 'Retina'],
        answerIndex: 1,
        explanation: 'Every voluntary movement exits the nervous system through spinal motor neurons.',
      },
      {
        prompt: 'Which area fine-tunes and corrects movements using error signals?',
        options: ['Hippocampus', 'Cerebellum', 'Amygdala', 'Olfactory bulb'],
        answerIndex: 1,
        explanation: 'The cerebellum compares intended and actual movement and corrects the difference.',
      },
      {
        prompt: 'A motor unit consists of...',
        options: [
          'One muscle and one thought',
          'One motor neuron and all muscle fibres it controls',
          'Two competing muscles',
          'One synapse in the brain',
        ],
        answerIndex: 1,
        explanation: 'A motor unit is one motor neuron together with the fibres it activates.',
      },
    ],
    xpReward: 22,
    coinReward: 8,
    masteryThreshold: 0.8,
  },
  {
    id: 'A12',
    trackId: 'neuroscience',
    moduleId: 'A-cortex',
    order: 12,
    title: 'Cortex and cortical layers',
    subtitle: 'A thin sheet, six stories deep',
    estimatedMinutes: 5,
    difficulty: 'beginner',
    prerequisites: ['A10'],
    explanation:
      'The cerebral cortex is a folded sheet about 2 to 4 millimetres thick, organised into six layers. Each layer has characteristic cells and connections. Sensory inputs arrive mostly in layer 4, and output projections leave mostly from layers 5 and 6.',
    keyTerms: ['cortex', 'layer 4', 'layer 5', 'column'],
    example:
      'In primary visual cortex, thalamic inputs land in layer 4, feedforward processing climbs through layers 2 and 3, and motor-linked outputs leave via layer 5.',
    intuition: 'Cortex is not a bag of cells. It is a sheet with a wiring diagram.',
    whyItMatters:
      'Most cortical models echo this layered structure, especially models of prediction and feedforward/feedback interactions.',
    questions: [
      {
        prompt: 'Sensory input from the thalamus typically arrives in cortical...',
        options: ['Layer 1', 'Layer 4', 'Layer 6', 'Outside the cortex'],
        answerIndex: 1,
        explanation: 'Layer 4 is the main input layer for sensory cortex.',
      },
      {
        prompt: 'Cortical output to distant areas comes mostly from...',
        options: ['Layer 2', 'Layer 4', 'Layer 5', 'Layer 1'],
        answerIndex: 2,
        explanation: 'Large pyramidal neurons in layer 5 project out to subcortical and other cortical targets.',
      },
      {
        prompt: 'A cortical column roughly refers to...',
        options: [
          'A bone in the skull',
          'A vertical group of cells with shared tuning',
          'A type of glial cell',
          'A brainstem nucleus',
        ],
        answerIndex: 1,
        explanation: 'Columns are vertical clusters of neurons that tend to share functional properties.',
      },
    ],
    xpReward: 24,
    coinReward: 8,
    masteryThreshold: 0.8,
  },
  {
    id: 'A13',
    trackId: 'neuroscience',
    moduleId: 'A-cortex',
    order: 13,
    title: 'Thalamus as relay and gate',
    subtitle: 'The hub at the centre',
    estimatedMinutes: 4,
    difficulty: 'beginner',
    prerequisites: ['A12'],
    explanation:
      'The thalamus sits at the centre of the brain and relays information between the periphery and the cortex. It is not just a passive switchboard: it gates, filters, and synchronises flow depending on behavioural state.',
    keyTerms: ['thalamus', 'relay nucleus', 'LGN', 'gating'],
    example:
      'The lateral geniculate nucleus is a thalamic station that relays visual information from the retina to primary visual cortex.',
    intuition: 'The thalamus is a gate that can open wide during wakefulness and narrow during sleep.',
    whyItMatters:
      'Models of attention and state-dependent processing almost always treat the thalamus as a gain gate.',
    questions: [
      {
        prompt: 'The LGN in the thalamus relays...',
        options: ['Touch', 'Vision', 'Smell', 'Balance'],
        answerIndex: 1,
        explanation: 'The lateral geniculate nucleus is the thalamic relay for vision.',
      },
      {
        prompt: 'The thalamus is best described as...',
        options: ['A passive pipe', 'A state-dependent gate and relay', 'A source of spikes without input', 'A sensor organ'],
        answerIndex: 1,
        explanation: 'Its relays are modulated by state, attention, and inhibitory circuits.',
      },
      {
        prompt: 'During deep sleep, thalamic relay generally becomes...',
        options: ['More open', 'More gated and rhythmic', 'Completely unaffected', 'Replaced by the hippocampus'],
        answerIndex: 1,
        explanation: 'Thalamic circuits produce slow rhythms and reduce feedforward flow during deep sleep.',
      },
    ],
    xpReward: 22,
    coinReward: 8,
    masteryThreshold: 0.8,
  },
  {
    id: 'A14',
    trackId: 'neuroscience',
    moduleId: 'A-subcort',
    order: 14,
    title: 'Basal ganglia and action selection',
    subtitle: 'Choosing what to do next',
    estimatedMinutes: 4,
    difficulty: 'beginner',
    prerequisites: ['A11'],
    explanation:
      'The basal ganglia are a set of deep nuclei involved in selecting and initiating actions. Direct and indirect pathways either release or suppress motor plans, and dopamine shifts the balance between them.',
    keyTerms: ['striatum', 'direct pathway', 'indirect pathway', 'dopamine'],
    example:
      'In Parkinson\u2019s disease, loss of dopamine makes it harder to release actions, slowing movement and making initiation effortful.',
    intuition: 'The basal ganglia are a selector that says "yes, do this one" and "no, not that one".',
    whyItMatters:
      'Reinforcement-learning models of the brain lean heavily on this circuit for selecting actions.',
    questions: [
      {
        prompt: 'The direct pathway of the basal ganglia tends to...',
        options: ['Suppress all movement', 'Release selected actions', 'Record memory only', 'Produce emotions directly'],
        answerIndex: 1,
        explanation: 'The direct pathway reduces inhibition on the thalamus, facilitating action.',
      },
      {
        prompt: 'Dopamine loss in the basal ganglia tends to cause...',
        options: ['Easier action initiation', 'Slowed movement', 'Forgetfulness only', 'Improved coordination'],
        answerIndex: 1,
        explanation: 'Less dopamine makes direct-pathway activation weaker, slowing movement.',
      },
      {
        prompt: 'The striatum is the main input region of the...',
        options: ['Cerebellum', 'Basal ganglia', 'Hippocampus', 'Retina'],
        answerIndex: 1,
        explanation: 'The striatum receives cortical and thalamic input into the basal ganglia.',
      },
    ],
    xpReward: 22,
    coinReward: 8,
    masteryThreshold: 0.8,
  },
  {
    id: 'A15',
    trackId: 'neuroscience',
    moduleId: 'A-subcort',
    order: 15,
    title: 'Cerebellum and error correction',
    subtitle: 'The engine of fine timing',
    estimatedMinutes: 4,
    difficulty: 'beginner',
    prerequisites: ['A11'],
    explanation:
      'The cerebellum contains more neurons than the rest of the brain combined. It uses climbing fibre error signals to teach Purkinje cells how to correct ongoing movements, and it contributes to the timing of many tasks, not just motor ones.',
    keyTerms: ['Purkinje cell', 'climbing fibre', 'parallel fibre', 'error signal'],
    example:
      'When you first learn to catch a ball, your cerebellum updates timing and precision every time you miss, until the movement feels effortless.',
    intuition: 'Errors are not punishment. They are teaching signals.',
    whyItMatters:
      'Classic theories of supervised learning in biology draw inspiration from cerebellar circuits.',
    questions: [
      {
        prompt: 'Climbing fibres in the cerebellum are thought to carry...',
        options: ['Reward signals', 'Error-like teaching signals', 'Sensory brightness', 'Voluntary decisions'],
        answerIndex: 1,
        explanation: 'Climbing fibres convey strong, sparse events that look like teaching signals.',
      },
      {
        prompt: 'Purkinje cells are the...',
        options: [
          'Input cells of the cerebellum',
          'Only output cells of the cerebellar cortex',
          'Glia',
          'Motor neurons',
        ],
        answerIndex: 1,
        explanation: 'Purkinje cells send the sole output from the cerebellar cortex.',
      },
      {
        prompt: 'The cerebellum is critical for...',
        options: ['Emotion only', 'Fine timing and motor correction', 'Color vision only', 'Blood circulation'],
        answerIndex: 1,
        explanation: 'It fine-tunes timing and precision for movement (and more).',
      },
    ],
    xpReward: 22,
    coinReward: 8,
    masteryThreshold: 0.8,
  },
  {
    id: 'A16',
    trackId: 'neuroscience',
    moduleId: 'A-memory',
    order: 16,
    title: 'Hippocampus and episodic memory',
    subtitle: 'Place, time, and story',
    estimatedMinutes: 5,
    difficulty: 'beginner',
    prerequisites: ['A12'],
    explanation:
      'The hippocampus helps bind "what", "where", and "when" into memories we can later replay. Place cells fire at specific locations, and during rest, sequences of them reactivate, as if the brain is rehearsing paths it has taken.',
    keyTerms: ['place cell', 'CA3', 'CA1', 'replay'],
    example:
      'In a maze, a rat\u2019s hippocampal place cells fire when the animal is in specific spots, collectively forming a map of the environment.',
    intuition: 'The hippocampus writes short, vivid stories the cortex later reads and keeps.',
    whyItMatters:
      'Models of memory, navigation, and offline learning start here.',
    questions: [
      {
        prompt: 'Place cells fire when an animal is in...',
        options: ['Any location', 'A specific location', 'Only at night', 'Only near walls'],
        answerIndex: 1,
        explanation: 'Place cells have receptive fields in space and fire when the animal enters them.',
      },
      {
        prompt: 'Hippocampal replay tends to occur during...',
        options: ['Only active running', 'Rest and sleep', 'Only REM sleep', 'Only during loud noises'],
        answerIndex: 1,
        explanation: 'Sequential replay often happens during quiet rest and sleep, and supports memory consolidation.',
      },
      {
        prompt: 'The hippocampus is most associated with...',
        options: ['Fine motor control', 'Binding episodic memories', 'Breathing rhythm', 'Balance'],
        answerIndex: 1,
        explanation: 'Damage to the hippocampus impairs the formation of new episodic memories.',
      },
    ],
    xpReward: 24,
    coinReward: 9,
    masteryThreshold: 0.8,
  },
  {
    id: 'A17',
    trackId: 'neuroscience',
    moduleId: 'A-memory',
    order: 17,
    title: 'Amygdala and emotion',
    subtitle: 'Fast tags for what matters',
    estimatedMinutes: 4,
    difficulty: 'beginner',
    prerequisites: ['A16'],
    explanation:
      'The amygdala is a small group of nuclei in the temporal lobe that tags stimuli with emotional significance, especially threat and reward. It modulates memory and attention so that important events stick.',
    keyTerms: ['amygdala', 'fear', 'salience', 'consolidation'],
    example:
      'A sudden loud sound activates the amygdala, which can speed heart rate, focus attention, and strengthen the memory of what just happened.',
    intuition: 'The amygdala says "mark this moment - it matters".',
    whyItMatters:
      'Many models of emotional learning, particularly fear conditioning, are grounded in amygdala circuits.',
    questions: [
      {
        prompt: 'The amygdala is most associated with...',
        options: ['Fine motor control', 'Tagging emotional significance', 'Breathing rhythm', 'Skin colour'],
        answerIndex: 1,
        explanation: 'It assigns emotional value, particularly for threat and salient events.',
      },
      {
        prompt: 'Fear conditioning experiments depend heavily on the...',
        options: ['Cerebellum', 'Amygdala', 'Retina', 'Thalamus only'],
        answerIndex: 1,
        explanation: 'Amygdala circuits are essential for forming conditioned fear.',
      },
      {
        prompt: 'Emotionally significant events tend to be remembered...',
        options: ['Worse than neutral ones', 'The same as neutral ones', 'Better than neutral ones', 'Not at all'],
        answerIndex: 2,
        explanation: 'Amygdala activity boosts consolidation, strengthening memories of salient events.',
      },
    ],
    xpReward: 22,
    coinReward: 8,
    masteryThreshold: 0.8,
  },
  {
    id: 'A18',
    trackId: 'neuroscience',
    moduleId: 'A-cognition',
    order: 18,
    title: 'Attention and executive control',
    subtitle: 'The spotlight and the conductor',
    estimatedMinutes: 5,
    difficulty: 'beginner',
    prerequisites: ['A12'],
    explanation:
      'Attention selects which signals the brain processes more fully, and executive control coordinates goals and actions. Prefrontal cortex plays a central role, interacting with parietal and subcortical areas to maintain goals and shift focus.',
    keyTerms: ['prefrontal cortex', 'selective attention', 'working memory', 'cognitive control'],
    example:
      'Finding a friend in a crowd relies on the prefrontal cortex holding their features in mind and biasing visual processing toward matching patterns.',
    intuition: 'Attention is not noticing more. It is noticing the right thing more.',
    whyItMatters:
      'Models of attention combine gain control, gating, and working memory loops.',
    questions: [
      {
        prompt: 'Prefrontal cortex is most associated with...',
        options: ['Primary touch sensation', 'Goal maintenance and cognitive control', 'Breathing', 'Sleep rhythms only'],
        answerIndex: 1,
        explanation: 'Prefrontal cortex maintains and manipulates information relevant to current goals.',
      },
      {
        prompt: 'Attention typically changes neural responses by...',
        options: [
          'Replacing them with new neurons',
          'Adjusting gain and selectivity',
          'Shutting off the thalamus permanently',
          'Disconnecting synapses',
        ],
        answerIndex: 1,
        explanation: 'Attentional effects include gain boosts, reduced noise, and sharper tuning.',
      },
      {
        prompt: 'Working memory can be thought of as...',
        options: [
          'A long-term storage vault',
          'A short-term scratch pad supported by ongoing activity',
          'A sensory organ',
          'A type of emotion',
        ],
        answerIndex: 1,
        explanation: 'Working memory is a transient store often linked to sustained neural activity.',
      },
    ],
    xpReward: 24,
    coinReward: 9,
    masteryThreshold: 0.8,
  },
  {
    id: 'A19',
    trackId: 'neuroscience',
    moduleId: 'A-cognition',
    order: 19,
    title: 'Sleep, rhythms, and oscillations',
    subtitle: 'When the brain rewrites itself',
    estimatedMinutes: 5,
    difficulty: 'beginner',
    prerequisites: ['A18'],
    explanation:
      'The brain is never truly idle. It cycles through rhythms from slow waves in deep sleep to faster gamma activity in wakefulness. These rhythms organise communication and support memory consolidation.',
    keyTerms: ['NREM sleep', 'REM sleep', 'slow oscillation', 'gamma rhythm'],
    example:
      'During deep sleep, slow oscillations coordinate reactivation of recent experiences, helping transfer them into more durable cortical memory.',
    intuition: 'Rhythms are the brain\u2019s schedule. Different bands mean different work shifts.',
    whyItMatters:
      'Models of sleep-based consolidation rely on oscillatory coupling between hippocampus and cortex.',
    questions: [
      {
        prompt: 'Slow oscillations are most prominent during...',
        options: ['REM sleep only', 'Deep NREM sleep', 'Focused attention', 'Physical exercise'],
        answerIndex: 1,
        explanation: 'Slow oscillations dominate deep non-REM sleep stages.',
      },
      {
        prompt: 'Gamma rhythms are often associated with...',
        options: ['Deep sleep', 'Active processing and perception', 'Unconsciousness', 'Muscle twitches only'],
        answerIndex: 1,
        explanation: 'Gamma activity tends to accompany active, focused neural processing.',
      },
      {
        prompt: 'Memory consolidation during sleep involves...',
        options: [
          'Erasing recent events to save space',
          'Reactivating recent experiences in coordination with cortex',
          'Randomly generating new memories',
          'Blocking all hippocampal activity',
        ],
        answerIndex: 1,
        explanation: 'Coordinated reactivation helps stabilise recent memories in cortical networks.',
      },
    ],
    xpReward: 24,
    coinReward: 9,
    masteryThreshold: 0.8,
  },
  {
    id: 'A20',
    trackId: 'neuroscience',
    moduleId: 'A-methods',
    order: 20,
    title: 'Modern neuroscience methods',
    subtitle: 'Electrophysiology, calcium imaging, fMRI, optogenetics',
    estimatedMinutes: 6,
    difficulty: 'beginner',
    prerequisites: ['A04'],
    explanation:
      'Neuroscientists have a growing toolkit. Electrophysiology records electrical signals directly from neurons. Calcium imaging uses fluorescent indicators to visualise many neurons at once. fMRI maps blood-flow changes across the whole brain. Optogenetics uses light to turn specific neurons on or off.',
    keyTerms: ['ephys', 'calcium imaging', 'fMRI', 'optogenetics'],
    example:
      'In a single modern experiment, researchers may image thousands of neurons with calcium imaging while using optogenetics to briefly silence a subset to see how others respond.',
    intuition: 'Different methods trade speed, coverage, and specificity - no single tool sees everything.',
    whyItMatters:
      'Understanding what a method can and cannot measure is essential to interpreting a model or a paper.',
    questions: [
      {
        prompt: 'fMRI measures which signal most directly?',
        options: ['Single spikes', 'Blood-flow changes related to activity', 'Neurotransmitter levels', 'DNA expression'],
        answerIndex: 1,
        explanation: 'fMRI tracks the BOLD signal, a proxy for local activity via blood oxygenation.',
      },
      {
        prompt: 'Optogenetics lets researchers...',
        options: [
          'Measure genes in the blood',
          'Turn specific neurons on or off with light',
          'See inside a closed skull with radiation',
          'Record muscle force only',
        ],
        answerIndex: 1,
        explanation: 'Light-sensitive channels like channelrhodopsin allow targeted neuronal control.',
      },
      {
        prompt: 'Calcium imaging is attractive because it...',
        options: [
          'Measures single spike timing perfectly',
          'Lets you watch many neurons at once with cell-type specificity',
          'Works without any indicator',
          'Requires no optics or microscope',
        ],
        answerIndex: 1,
        explanation: 'Calcium imaging scales to many neurons simultaneously, though its time resolution is coarser than ephys.',
      },
    ],
    xpReward: 26,
    coinReward: 10,
    masteryThreshold: 0.8,
  },
  {
    id: 'A21',
    trackId: 'neuroscience',
    moduleId: 'A-microstructure',
    order: 21,
    title: 'Dendritic spines',
    subtitle: 'Tiny compartments that shape synaptic input',
    estimatedMinutes: 5,
    difficulty: 'beginner',
    prerequisites: ['A05'],
    explanation:
      'Many excitatory synapses land on dendritic spines: small protrusions on dendrites with a narrow neck and a rounded head. A spine can partly isolate chemical and electrical signals, so one synapse can change without immediately changing the whole dendrite. Spine size, shape, and receptor content help determine how strongly an input affects the neuron.',
    keyTerms: ['dendritic spine', 'spine head', 'spine neck', 'postsynaptic density'],
    example:
      'A learning event can enlarge some spines and add more AMPA receptors, making those specific synaptic inputs more effective.',
    intuition:
      'Think of spines as tiny workbenches on a dendrite: each one can tune a single connection without rewiring the whole cell.',
    whyItMatters:
      'Spines link cellular anatomy to learning, because many long-term synaptic changes happen at this microscopic scale.',
    questions: [
      {
        prompt: 'Most dendritic spines receive which kind of input?',
        options: ['Excitatory synaptic input', 'Blood-flow input', 'Myelin input', 'Cerebrospinal fluid input'],
        answerIndex: 0,
        explanation: 'Spines are common postsynaptic sites for excitatory synapses, especially in cortex and hippocampus.',
      },
      {
        prompt: 'Why does a spine neck matter?',
        options: [
          'It can partly isolate local signals',
          'It makes the neuron unable to spike',
          'It stores oxygen for the cell',
          'It blocks all receptor movement',
        ],
        answerIndex: 0,
        explanation: 'The thin neck helps local biochemical and voltage signals remain partly compartmentalised.',
      },
      {
        prompt: 'A larger, receptor-rich spine often indicates...',
        options: ['A stronger synaptic connection', 'A dead neuron', 'A myelinated axon', 'A blood-brain barrier leak'],
        answerIndex: 0,
        explanation: 'Large spines often have larger postsynaptic densities and stronger synaptic responses.',
      },
    ],
    xpReward: 24,
    coinReward: 9,
    masteryThreshold: 0.8,
  },
  {
    id: 'A22',
    trackId: 'neuroscience',
    moduleId: 'A-microstructure',
    order: 22,
    title: 'Myelin and nodes',
    subtitle: 'How axons send signals faster',
    estimatedMinutes: 5,
    difficulty: 'beginner',
    prerequisites: ['A09'],
    explanation:
      'Myelin is a fatty insulating wrap around many axons. It is made by oligodendrocytes in the central nervous system and Schwann cells in the peripheral nervous system. Gaps in the wrap, called nodes of Ranvier, contain dense voltage-gated sodium channels. Action potentials appear to jump from node to node, which makes signalling faster and more energy efficient.',
    keyTerms: ['myelin', 'node of Ranvier', 'saltatory conduction', 'oligodendrocyte'],
    example:
      'Fast touch and motor signals often travel along large myelinated axons, allowing quick reactions.',
    intuition:
      'Myelin works like insulation around a wire, while nodes act like relay stations that refresh the signal.',
    whyItMatters:
      'Diseases that damage myelin can slow or block communication, changing movement, sensation, and cognition.',
    questions: [
      {
        prompt: 'A node of Ranvier is...',
        options: [
          'A gap in myelin rich in ion channels',
          'A type of neurotransmitter',
          'A dendritic spine',
          'A blood vessel branch',
        ],
        answerIndex: 0,
        explanation: 'Nodes are small unmyelinated gaps with many voltage-gated channels.',
      },
      {
        prompt: 'Myelin generally makes axonal signalling...',
        options: ['Faster and more efficient', 'Slower and random', 'Impossible', 'Only chemical'],
        answerIndex: 0,
        explanation: 'Myelin reduces current leak and supports fast saltatory conduction.',
      },
      {
        prompt: 'In the central nervous system, myelin is produced mainly by...',
        options: ['Oligodendrocytes', 'Red blood cells', 'Platelets', 'Photoreceptors'],
        answerIndex: 0,
        explanation: 'Oligodendrocytes myelinate CNS axons; Schwann cells myelinate peripheral axons.',
      },
    ],
    xpReward: 24,
    coinReward: 9,
    masteryThreshold: 0.8,
  },
  {
    id: 'A23',
    trackId: 'neuroscience',
    moduleId: 'A-microstructure',
    order: 23,
    title: 'Axonal transport',
    subtitle: 'Moving supplies through long neurons',
    estimatedMinutes: 5,
    difficulty: 'beginner',
    prerequisites: ['A01'],
    explanation:
      'Some neurons have axons that are extremely long, so the cell needs an internal delivery system. Motor proteins move cargo along microtubule tracks. Anterograde transport carries vesicles, proteins, and mitochondria from the cell body toward axon terminals. Retrograde transport carries used materials and signals back to the cell body.',
    keyTerms: ['microtubule', 'motor protein', 'anterograde transport', 'retrograde transport'],
    example:
      'A motor neuron must deliver mitochondria and synaptic vesicle proteins all the way from the spinal cord to a muscle terminal.',
    intuition:
      'Axonal transport is the neuron logistics network: tracks, motors, cargo, and return messages.',
    whyItMatters:
      'Transport failure can starve synapses of energy and materials, making it relevant to several neurodegenerative diseases.',
    questions: [
      {
        prompt: 'Anterograde transport moves cargo...',
        options: [
          'From cell body toward the axon terminal',
          'From synapse to bloodstream',
          'Only inside dendritic spines',
          'From myelin into cerebrospinal fluid',
        ],
        answerIndex: 0,
        explanation: 'Anterograde means outward from the soma toward axon terminals.',
      },
      {
        prompt: 'Microtubules in axons mainly act as...',
        options: ['Tracks for intracellular transport', 'Neurotransmitters', 'Blood barriers', 'Receptors for light'],
        answerIndex: 0,
        explanation: 'Motor proteins walk along microtubules while carrying cargo.',
      },
      {
        prompt: 'Retrograde transport is useful because it...',
        options: [
          'Returns signals and used materials to the cell body',
          'Deletes every synapse',
          'Stops all action potentials',
          'Creates myelin by itself',
        ],
        answerIndex: 0,
        explanation: 'Retrograde transport lets the soma receive information from distant axon terminals.',
      },
    ],
    xpReward: 23,
    coinReward: 8,
    masteryThreshold: 0.8,
  },
  {
    id: 'A24',
    trackId: 'neuroscience',
    moduleId: 'A-learning',
    order: 24,
    title: 'Synaptic plasticity',
    subtitle: 'How connections become stronger or weaker',
    estimatedMinutes: 6,
    difficulty: 'beginner',
    prerequisites: ['A05'],
    explanation:
      'Synaptic plasticity means that synaptic strength can change with activity. Long-term potentiation (LTP) increases the effect of a synapse; long-term depression (LTD) decreases it. Timing, receptor activation, calcium signals, and neuromodulators all influence which change happens. Plasticity is not the whole story of memory, but it is one of its key cellular mechanisms.',
    keyTerms: ['plasticity', 'LTP', 'LTD', 'Hebbian learning'],
    example:
      'If a presynaptic neuron repeatedly helps drive a postsynaptic neuron to fire, that connection can become more effective.',
    intuition:
      'Plasticity is the brain updating its wiring weights based on experience.',
    whyItMatters:
      'Learning, adaptation, rehabilitation, and maladaptive habits all depend on the fact that circuits can change.',
    questions: [
      {
        prompt: 'Long-term potentiation usually means...',
        options: ['A synapse becomes stronger', 'A synapse disappears instantly', 'Myelin melts', 'The skull grows'],
        answerIndex: 0,
        explanation: 'LTP is a lasting increase in synaptic efficacy.',
      },
      {
        prompt: 'Hebbian learning is often summarised as...',
        options: [
          'Cells that fire together wire together',
          'Neurons cannot change after birth',
          'Only glia can learn',
          'All memories live in one cell',
        ],
        answerIndex: 0,
        explanation: 'Hebbian ideas link correlated pre- and postsynaptic activity to stronger connections.',
      },
      {
        prompt: 'Why is calcium important in many plasticity mechanisms?',
        options: [
          'It acts as a local biochemical signal',
          'It is the only neurotransmitter',
          'It replaces DNA',
          'It prevents receptors from moving',
        ],
        answerIndex: 0,
        explanation: 'Calcium entering spines can trigger molecular pathways that strengthen or weaken synapses.',
      },
    ],
    xpReward: 26,
    coinReward: 10,
    masteryThreshold: 0.8,
  },
  {
    id: 'A25',
    trackId: 'neuroscience',
    moduleId: 'A-learning',
    order: 25,
    title: 'Homeostasis in circuits',
    subtitle: 'Keeping activity in a useful range',
    estimatedMinutes: 5,
    difficulty: 'beginner',
    prerequisites: ['A06'],
    explanation:
      'Neural circuits need plasticity, but too much strengthening can make activity unstable. Homeostatic mechanisms keep firing rates and excitability within workable ranges. Neurons can scale synaptic strengths, change ion-channel expression, or adjust inhibition to avoid silence or runaway excitation.',
    keyTerms: ['homeostasis', 'set point', 'synaptic scaling', 'excitability'],
    example:
      'If a neuron receives too little input for a long time, it may increase receptor expression so the remaining inputs have more impact.',
    intuition:
      'Homeostasis is the circuit thermostat: it does not encode a specific memory, but it keeps the room usable.',
    whyItMatters:
      'Stable learning needs both change and control; homeostasis explains why brains adapt without constantly saturating.',
    questions: [
      {
        prompt: 'Homeostatic plasticity mainly helps circuits...',
        options: ['Stay within a functional activity range', 'Erase all memories', 'Stop using synapses', 'Turn neurons into glia'],
        answerIndex: 0,
        explanation: 'Homeostasis counters extremes such as too much excitation or too little activity.',
      },
      {
        prompt: 'A set point is best described as...',
        options: [
          'A target range for a regulated variable',
          'A fixed memory trace',
          'A type of axon',
          'A neurotransmitter vesicle',
        ],
        answerIndex: 0,
        explanation: 'A set point is a reference range the system tends to defend.',
      },
      {
        prompt: 'Synaptic scaling changes...',
        options: [
          'Many synapses together to stabilise activity',
          'Only the colour of a neuron',
          'Blood oxygenation directly',
          'The shape of the skull',
        ],
        answerIndex: 0,
        explanation: 'Scaling can adjust many synapses up or down while preserving relative differences.',
      },
    ],
    xpReward: 24,
    coinReward: 9,
    masteryThreshold: 0.8,
  },
  {
    id: 'A26',
    trackId: 'neuroscience',
    moduleId: 'A-support',
    order: 26,
    title: 'Brain energy',
    subtitle: 'Why signalling is metabolically expensive',
    estimatedMinutes: 5,
    difficulty: 'beginner',
    prerequisites: ['A09'],
    explanation:
      'The brain uses a large share of the body energy budget. Much of that energy restores ion gradients after synaptic currents and spikes. Neurons depend on oxygen and glucose delivered by blood, while astrocytes help coordinate local metabolism. When energy supply fails, electrical signalling is rapidly compromised.',
    keyTerms: ['glucose', 'oxygen', 'ATP', 'ion gradient'],
    example:
      'A burst of local activity increases energy demand, followed by changes in blood flow that imaging methods can detect.',
    intuition:
      'Every spike has a hidden bill: pumps must spend ATP to reset ionic gradients.',
    whyItMatters:
      'Metabolism connects cellular neuroscience to fMRI signals, fatigue, stroke, and brain health.',
    questions: [
      {
        prompt: 'A major energy cost in neurons is...',
        options: [
          'Restoring ion gradients after activity',
          'Making bones harder',
          'Keeping blood red',
          'Producing light for vision',
        ],
        answerIndex: 0,
        explanation: 'Ion pumps use ATP to restore gradients after synaptic currents and spikes.',
      },
      {
        prompt: 'The brain mainly relies on blood to deliver...',
        options: ['Oxygen and glucose', 'Myelin and memories', 'Axons and dendrites', 'Photons and calcium only'],
        answerIndex: 0,
        explanation: 'Oxygen and glucose support ATP production in neural tissue.',
      },
      {
        prompt: 'Astrocytes contribute to energy use by...',
        options: [
          'Helping coordinate local metabolism',
          'Generating every action potential',
          'Replacing all neurons',
          'Blocking all blood flow',
        ],
        answerIndex: 0,
        explanation: 'Astrocytes help couple neural activity, metabolism, and blood-flow responses.',
      },
    ],
    xpReward: 24,
    coinReward: 9,
    masteryThreshold: 0.8,
  },
  {
    id: 'A27',
    trackId: 'neuroscience',
    moduleId: 'A-support',
    order: 27,
    title: 'Blood-brain barrier',
    subtitle: 'A selective border around neural tissue',
    estimatedMinutes: 5,
    difficulty: 'beginner',
    prerequisites: ['A09'],
    explanation:
      'The blood-brain barrier is formed by specialised blood vessel cells, tight junctions, astrocyte endfeet, and pericytes. It keeps the chemical environment of the brain stable by controlling which substances pass from blood into neural tissue. This protection is essential, but it also makes drug delivery to the brain difficult.',
    keyTerms: ['blood-brain barrier', 'tight junction', 'pericyte', 'astrocyte endfoot'],
    example:
      'A useful drug in the bloodstream may fail as a brain treatment if it cannot cross the blood-brain barrier.',
    intuition:
      'The barrier acts like a strict border checkpoint, allowing supplies through while blocking many risky molecules.',
    whyItMatters:
      'Barrier function matters in inflammation, infection, stroke, drug design, and many neurological disorders.',
    questions: [
      {
        prompt: 'The blood-brain barrier mainly helps...',
        options: [
          'Maintain a controlled brain environment',
          'Create action potentials directly',
          'Store all memories',
          'Turn axons into dendrites',
        ],
        answerIndex: 0,
        explanation: 'The barrier limits uncontrolled exchange between blood and neural tissue.',
      },
      {
        prompt: 'Tight junctions are important because they...',
        options: [
          'Limit leakage between vessel cells',
          'Release dopamine at synapses',
          'Make myelin',
          'Measure fMRI signals',
        ],
        answerIndex: 0,
        explanation: 'Tight junctions restrict paracellular passage across the vessel wall.',
      },
      {
        prompt: 'A practical consequence of the barrier is that...',
        options: [
          'Some drugs cannot easily enter the brain',
          'All drugs enter the brain freely',
          'Neurons no longer need oxygen',
          'Blood vessels stop carrying glucose',
        ],
        answerIndex: 0,
        explanation: 'The barrier protects the brain but complicates delivery of many treatments.',
      },
    ],
    xpReward: 24,
    coinReward: 9,
    masteryThreshold: 0.8,
  },
  {
    id: 'A28',
    trackId: 'neuroscience',
    moduleId: 'A-development',
    order: 28,
    title: 'Brain development',
    subtitle: 'From newborn neurons to organised circuits',
    estimatedMinutes: 6,
    difficulty: 'beginner',
    prerequisites: ['A01'],
    explanation:
      'Brain development builds circuits through many coordinated steps: neurons are born, migrate to the right region, extend axons and dendrites, form synapses, and later refine connections. Early circuits often produce more connections than they keep. Activity and molecular guidance cues help sculpt the final architecture.',
    keyTerms: ['neurogenesis', 'migration', 'axon guidance', 'synaptic pruning'],
    example:
      'In the developing cortex, young neurons migrate outward along radial glial guides before settling into layers.',
    intuition:
      'Development is not just growth; it is construction plus editing.',
    whyItMatters:
      'Many adult circuit properties and developmental disorders make more sense when you know how circuits are assembled.',
    questions: [
      {
        prompt: 'Neuronal migration means...',
        options: [
          'New neurons move toward their final positions',
          'Mature neurons leave the skull',
          'Blood cells become synapses',
          'Myelin turns into cortex',
        ],
        answerIndex: 0,
        explanation: 'During development, many neurons travel before settling in their target layers or nuclei.',
      },
      {
        prompt: 'Synaptic pruning usually refers to...',
        options: [
          'Removing or weakening extra connections',
          'Making every synapse permanent',
          'Deleting all inhibition',
          'Producing glucose',
        ],
        answerIndex: 0,
        explanation: 'Pruning refines circuits by removing some connections and keeping others.',
      },
      {
        prompt: 'Development uses both molecular cues and...',
        options: ['Neural activity', 'Moonlight', 'Bone density', 'Red blood cell spikes'],
        answerIndex: 0,
        explanation: 'Activity helps refine maps and connections after broad molecular guidance.',
      },
    ],
    xpReward: 26,
    coinReward: 10,
    masteryThreshold: 0.8,
  },
  {
    id: 'A29',
    trackId: 'neuroscience',
    moduleId: 'A-development',
    order: 29,
    title: 'Critical periods',
    subtitle: 'Windows when experience has extra impact',
    estimatedMinutes: 5,
    difficulty: 'beginner',
    prerequisites: ['A28'],
    explanation:
      'A critical period is a developmental window when specific experiences strongly shape a circuit. For example, balanced visual input early in life helps organise visual cortex. Critical periods open and close through changes in inhibition, plasticity molecules, neuromodulators, and circuit maturation. Adult brains remain plastic, but some forms of change become harder.',
    keyTerms: ['critical period', 'experience-dependent plasticity', 'inhibition', 'circuit maturation'],
    example:
      'If one eye is deprived of normal input during an early visual critical period, visual cortex can become biased toward the other eye.',
    intuition:
      'A critical period is like wet clay: experience can leave deep marks before the circuit hardens.',
    whyItMatters:
      'Critical periods explain why early experience can be powerful and why timing matters in therapy and education.',
    questions: [
      {
        prompt: 'A critical period is...',
        options: [
          'A time window of unusually strong experience-dependent plasticity',
          'A period with no synapses',
          'Any single action potential',
          'A method for measuring blood flow',
        ],
        answerIndex: 0,
        explanation: 'Critical periods are developmental windows when experience strongly shapes circuits.',
      },
      {
        prompt: 'Adult brains are best described as...',
        options: [
          'Still plastic, but often less flexible than during some early windows',
          'Completely unable to learn',
          'Made only of new neurons',
          'Unconnected to experience',
        ],
        answerIndex: 0,
        explanation: 'Adults can learn, but some circuit changes become more constrained after critical periods.',
      },
      {
        prompt: 'Inhibition can help critical periods by...',
        options: [
          'Regulating when circuits become ready for plasticity',
          'Destroying all sensory maps',
          'Replacing oxygen in blood',
          'Making synapses impossible',
        ],
        answerIndex: 0,
        explanation: 'Maturation of inhibitory circuits is one factor controlling critical-period timing.',
      },
    ],
    xpReward: 24,
    coinReward: 9,
    masteryThreshold: 0.8,
  },
  {
    id: 'A30',
    trackId: 'neuroscience',
    moduleId: 'A-networks',
    order: 30,
    title: 'Connectomes and motifs',
    subtitle: 'Seeing circuits as networks',
    estimatedMinutes: 6,
    difficulty: 'beginner',
    prerequisites: ['A12'],
    explanation:
      'A connectome is a map of connections in a nervous system or brain region. At small scales it may describe synapses between cells; at large scales it may describe pathways between regions. Network motifs are repeated patterns such as feedforward chains, reciprocal loops, and hubs. These structures shape how activity flows through a circuit.',
    keyTerms: ['connectome', 'network motif', 'hub', 'feedforward loop'],
    example:
      'A feedforward inhibitory motif can make responses brief: excitation arrives, then a delayed inhibitory signal shuts the response down.',
    intuition:
      'A connectome is the wiring map; motifs are the small circuit patterns that appear again and again.',
    whyItMatters:
      'Network structure helps explain why two circuits with similar neurons can compute very different things.',
    questions: [
      {
        prompt: 'A connectome is a map of...',
        options: ['Neural connections', 'Only blood pressure', 'Skull thickness', 'Hormone names only'],
        answerIndex: 0,
        explanation: 'A connectome describes how neurons or brain regions are connected.',
      },
      {
        prompt: 'A network motif is...',
        options: [
          'A repeated connection pattern',
          'A single neurotransmitter molecule',
          'A type of MRI scanner',
          'A memory stored in one receptor',
        ],
        answerIndex: 0,
        explanation: 'Motifs are recurring arrangements such as loops, hubs, and feedforward structures.',
      },
      {
        prompt: 'Why do hubs matter in networks?',
        options: [
          'They connect many nodes and can strongly affect communication',
          'They stop all information flow',
          'They are always inactive',
          'They only exist in muscles',
        ],
        answerIndex: 0,
        explanation: 'Highly connected hubs can coordinate or bottleneck activity across a network.',
      },
    ],
    xpReward: 26,
    coinReward: 10,
    masteryThreshold: 0.8,
  },
  {
    id: 'A31',
    trackId: 'neuroscience',
    moduleId: 'A-networks',
    order: 31,
    title: 'Resting-state networks',
    subtitle: 'Organised activity when you are not doing a task',
    estimatedMinutes: 5,
    difficulty: 'beginner',
    prerequisites: ['A19'],
    explanation:
      'The brain is active even at rest. Resting-state networks are groups of regions whose activity fluctuates together when a person is not performing a specific task. Examples include the default mode, attention, salience, and control networks. These patterns are usually measured with fMRI, but they reflect broad coordination rather than direct single-neuron firing.',
    keyTerms: ['resting state', 'default mode network', 'functional connectivity', 'BOLD signal'],
    example:
      'Two regions can show functional connectivity if their fMRI signals rise and fall together across time.',
    intuition:
      'Rest is not silence; it is a different operating mode with organised background rhythms.',
    whyItMatters:
      'Resting-state networks are used to study development, disease, consciousness, and large-scale brain organisation.',
    questions: [
      {
        prompt: 'Functional connectivity usually means...',
        options: [
          'Two signals fluctuate together statistically',
          'Two neurons are physically fused',
          'A synapse is always excitatory',
          'A person is asleep',
        ],
        answerIndex: 0,
        explanation: 'Functional connectivity is commonly inferred from correlated activity patterns.',
      },
      {
        prompt: 'Resting-state fMRI mainly measures...',
        options: ['Blood-oxygenation related signals', 'Individual vesicle release', 'DNA sequence', 'Muscle fibre length'],
        answerIndex: 0,
        explanation: 'Resting-state fMRI tracks slow BOLD fluctuations across brain regions.',
      },
      {
        prompt: 'The default mode network is often active during...',
        options: [
          'Internally focused thought and rest',
          'Only spinal reflexes',
          'Only eye blinks',
          'Complete brain inactivity',
        ],
        answerIndex: 0,
        explanation: 'The default mode network is associated with rest, memory, self-related thought, and internal mentation.',
      },
    ],
    xpReward: 24,
    coinReward: 9,
    masteryThreshold: 0.8,
  },
  {
    id: 'A32',
    trackId: 'neuroscience',
    moduleId: 'A-networks',
    order: 32,
    title: 'Arousal and brain state',
    subtitle: 'Why the same circuit behaves differently over time',
    estimatedMinutes: 5,
    difficulty: 'beginner',
    prerequisites: ['A13'],
    explanation:
      'Arousal is the global level of wakefulness, alertness, and readiness to respond. Brain state changes with sleep, attention, stress, motivation, and neuromodulators such as acetylcholine, dopamine, noradrenaline, and serotonin. The same sensory input can produce different responses depending on state.',
    keyTerms: ['arousal', 'brain state', 'neuromodulator', 'wakefulness'],
    example:
      'A quiet sound may be ignored during deep sleep, noticed during calm wakefulness, and trigger a rapid response during high alertness.',
    intuition:
      'Brain state is a context dial that changes the gain and priorities of many circuits at once.',
    whyItMatters:
      'Experiments, learning, perception, and clinical symptoms all depend on state, not just on the stimulus.',
    questions: [
      {
        prompt: 'Arousal describes...',
        options: [
          'The brain level of wakefulness and readiness',
          'Only muscle size',
          'The number of skull bones',
          'The colour of a neuron',
        ],
        answerIndex: 0,
        explanation: 'Arousal is a global state variable related to alertness and responsiveness.',
      },
      {
        prompt: 'Neuromodulators often...',
        options: [
          'Change circuit gain and state over broad areas',
          'Act only as structural proteins',
          'Prevent any learning',
          'Replace every synapse with myelin',
        ],
        answerIndex: 0,
        explanation: 'Neuromodulators can adjust excitability, plasticity, and network mode across circuits.',
      },
      {
        prompt: 'The same stimulus can evoke different responses because...',
        options: [
          'Brain state changes how circuits process input',
          'Stimuli never reach the brain',
          'Neurons are identical at all times',
          'Synapses cannot change',
        ],
        answerIndex: 0,
        explanation: 'Attention, sleep, motivation, and arousal can all change neural responses.',
      },
    ],
    xpReward: 24,
    coinReward: 9,
    masteryThreshold: 0.8,
  },
  {
    id: 'A33',
    trackId: 'neuroscience',
    moduleId: 'A-body',
    order: 33,
    title: 'Pain pathways',
    subtitle: 'Signals, gates, and perception',
    estimatedMinutes: 6,
    difficulty: 'beginner',
    prerequisites: ['A10'],
    explanation:
      'Pain begins with nociceptors that detect potentially damaging stimuli. Their signals enter the spinal cord, ascend toward the thalamus and cortex, and interact with emotion and attention systems. Pain is not just a raw input: descending pathways from the brain can amplify or suppress spinal signals, which is why context changes pain experience.',
    keyTerms: ['nociceptor', 'spinal cord', 'thalamus', 'descending modulation'],
    example:
      'An athlete may notice an injury less during a competition because attention, stress, and descending control alter pain processing.',
    intuition:
      'Pain is a protected warning system with a volume knob, not a simple damage meter.',
    whyItMatters:
      'Chronic pain often involves altered nervous-system processing, so treatment must consider both body and brain.',
    questions: [
      {
        prompt: 'Nociceptors detect...',
        options: ['Potentially damaging stimuli', 'Only pleasant touch', 'Blood oxygen only', 'Memories directly'],
        answerIndex: 0,
        explanation: 'Nociceptors respond to tissue threat such as heat, mechanical damage, or chemical irritation.',
      },
      {
        prompt: 'Descending modulation means...',
        options: [
          'Brain pathways can alter spinal pain signals',
          'Pain only travels from cortex to skin',
          'The thalamus is disconnected',
          'Nociceptors become blood vessels',
        ],
        answerIndex: 0,
        explanation: 'Descending pathways can inhibit or facilitate pain transmission in the spinal cord.',
      },
      {
        prompt: 'Pain differs from a simple damage meter because...',
        options: [
          'Attention, emotion, and context shape perception',
          'It never involves the brain',
          'It is always proportional to injury size',
          'It only occurs during sleep',
        ],
        answerIndex: 0,
        explanation: 'Pain is constructed by nervous-system processing, not read out as a fixed physical value.',
      },
    ],
    xpReward: 26,
    coinReward: 10,
    masteryThreshold: 0.8,
  },
  {
    id: 'A34',
    trackId: 'neuroscience',
    moduleId: 'A-body',
    order: 34,
    title: 'Interoception',
    subtitle: 'How the brain senses the body from inside',
    estimatedMinutes: 5,
    difficulty: 'beginner',
    prerequisites: ['A13'],
    explanation:
      'Interoception is sensing the internal state of the body: heartbeat, breathing, gut signals, temperature, inflammation, and more. These signals reach brainstem, thalamus, insula, anterior cingulate, and other regions. Interoception helps regulate behaviour because the brain needs to know the body condition before choosing actions.',
    keyTerms: ['interoception', 'insula', 'body state', 'homeostasis'],
    example:
      'Feeling thirsty, nauseous, hungry, breathless, or calm all depends partly on interoceptive processing.',
    intuition:
      'Interoception is the brain dashboard for the body interior.',
    whyItMatters:
      'Mood, anxiety, fatigue, decision-making, and self-awareness all interact with internal body signals.',
    questions: [
      {
        prompt: 'Interoception refers to sensing...',
        options: ['Internal body state', 'Only distant sounds', 'Only colour', 'Only written words'],
        answerIndex: 0,
        explanation: 'Interoception covers signals such as heartbeat, breathing, hunger, and gut state.',
      },
      {
        prompt: 'The insula is often linked to...',
        options: ['Body-state awareness', 'Making myelin only', 'Producing blood cells', 'Blocking every hormone'],
        answerIndex: 0,
        explanation: 'The insula is a key cortical region for integrating internal body signals.',
      },
      {
        prompt: 'Interoception matters for behaviour because...',
        options: [
          'Actions depend on the current body state',
          'The body sends no signals to the brain',
          'It prevents emotion',
          'It is separate from homeostasis',
        ],
        answerIndex: 0,
        explanation: 'The brain uses internal state information to regulate needs and choose appropriate actions.',
      },
    ],
    xpReward: 24,
    coinReward: 9,
    masteryThreshold: 0.8,
  },
  {
    id: 'A35',
    trackId: 'neuroscience',
    moduleId: 'A-body',
    order: 35,
    title: 'Autonomic nervous system',
    subtitle: 'Automatic control of organs',
    estimatedMinutes: 5,
    difficulty: 'beginner',
    prerequisites: ['A11'],
    explanation:
      'The autonomic nervous system controls organs without requiring conscious effort. The sympathetic branch prepares the body for action by increasing heart rate and mobilising energy. The parasympathetic branch supports restoration, digestion, and calm regulation. These branches work with the brainstem, hypothalamus, and body feedback loops.',
    keyTerms: ['autonomic nervous system', 'sympathetic', 'parasympathetic', 'vagus nerve'],
    example:
      'Before an exam, sympathetic activity can raise heart rate; after eating, parasympathetic activity supports digestion.',
    intuition:
      'Autonomic control is the body autopilot that keeps organs matched to the situation.',
    whyItMatters:
      'Stress, sleep, emotion, exercise, digestion, and many clinical symptoms involve autonomic regulation.',
    questions: [
      {
        prompt: 'The sympathetic branch generally supports...',
        options: ['Action and energy mobilisation', 'Only digestion during sleep', 'Visual image formation', 'Synaptic pruning only'],
        answerIndex: 0,
        explanation: 'Sympathetic activation prepares the body for challenge or action.',
      },
      {
        prompt: 'The parasympathetic branch often supports...',
        options: ['Restoration and digestion', 'Bone growth only', 'Spinal myelination only', 'Random spikes only'],
        answerIndex: 0,
        explanation: 'Parasympathetic activity supports rest, digestion, and recovery.',
      },
      {
        prompt: 'Autonomic control is important because...',
        options: [
          'The brain must regulate organs continuously',
          'Organs are disconnected from nerves',
          'All organ control is voluntary',
          'Heart rate never changes',
        ],
        answerIndex: 0,
        explanation: 'Autonomic circuits regulate heart rate, blood pressure, digestion, breathing, and more.',
      },
    ],
    xpReward: 24,
    coinReward: 9,
    masteryThreshold: 0.8,
  },
  {
    id: 'A36',
    trackId: 'neuroscience',
    moduleId: 'A-body',
    order: 36,
    title: 'Stress and the HPA axis',
    subtitle: 'How brain and hormones coordinate challenge',
    estimatedMinutes: 6,
    difficulty: 'beginner',
    prerequisites: ['A17'],
    explanation:
      'Stress responses involve fast autonomic changes and slower hormonal loops. The HPA axis connects hypothalamus, pituitary, and adrenal glands. It helps release cortisol, which mobilises energy and feeds back to the brain. Acute stress can be adaptive; chronic stress can disrupt sleep, mood, immunity, and cognition.',
    keyTerms: ['stress', 'HPA axis', 'cortisol', 'feedback loop'],
    example:
      'A sudden threat can rapidly increase heart rate, while cortisol rises more slowly to support sustained energy mobilisation.',
    intuition:
      'The HPA axis is a brain-body alarm loop with feedback so the alarm can turn down again.',
    whyItMatters:
      'Stress biology links neuroscience to mental health, learning, immune function, and everyday behaviour.',
    questions: [
      {
        prompt: 'HPA stands for...',
        options: [
          'Hypothalamus, pituitary, adrenal',
          'Hippocampus, pons, amygdala',
          'Heart, pancreas, artery',
          'High-power axon',
        ],
        answerIndex: 0,
        explanation: 'The HPA axis links hypothalamus, pituitary, and adrenal glands.',
      },
      {
        prompt: 'Cortisol is best described as...',
        options: ['A stress-related hormone', 'A myelin protein', 'A visual pigment', 'A synaptic vesicle'],
        answerIndex: 0,
        explanation: 'Cortisol is released through HPA-axis activity and helps regulate energy and stress responses.',
      },
      {
        prompt: 'Chronic stress can be harmful because it may...',
        options: [
          'Disrupt sleep, mood, immunity, and cognition',
          'Improve every circuit without cost',
          'Stop all hormone release forever',
          'Turn off the brain permanently during exams',
        ],
        answerIndex: 0,
        explanation: 'Long-lasting stress responses can strain many body and brain systems.',
      },
    ],
    xpReward: 26,
    coinReward: 10,
    masteryThreshold: 0.8,
  },
  {
    id: 'A37',
    trackId: 'neuroscience',
    moduleId: 'A-health',
    order: 37,
    title: 'Neuroinflammation and repair',
    subtitle: 'Immune signals inside the nervous system',
    estimatedMinutes: 5,
    difficulty: 'beginner',
    prerequisites: ['A09'],
    explanation:
      'The brain has immune-like support systems. Microglia survey tissue, remove debris, shape synapses, and release inflammatory signals when needed. Inflammation can protect and repair, but excessive or chronic inflammation can damage circuits. Astrocytes, blood vessels, and the blood-brain barrier also participate in injury responses.',
    keyTerms: ['microglia', 'neuroinflammation', 'cytokine', 'repair'],
    example:
      'After injury, microglia can help clear damaged material, but prolonged activation can also disturb synaptic function.',
    intuition:
      'Inflammation is a repair crew that becomes risky when it stays overactive.',
    whyItMatters:
      'Inflammatory processes are relevant to infection, trauma, multiple sclerosis, ageing, and psychiatric symptoms.',
    questions: [
      {
        prompt: 'Microglia are important because they...',
        options: [
          'Survey tissue and respond to damage',
          'Carry visual images to the retina',
          'Produce every action potential',
          'Replace the skull',
        ],
        answerIndex: 0,
        explanation: 'Microglia are resident immune-like cells of the central nervous system.',
      },
      {
        prompt: 'Neuroinflammation can be...',
        options: [
          'Protective in moderation and harmful when chronic',
          'Always absent from the brain',
          'Only a type of myelin',
          'The same thing as learning a word',
        ],
        answerIndex: 0,
        explanation: 'Inflammation can help repair but can also disrupt tissue if excessive or persistent.',
      },
      {
        prompt: 'Cytokines are...',
        options: ['Immune signalling molecules', 'Voltage-gated channels only', 'Brain ventricles', 'Motor proteins only'],
        answerIndex: 0,
        explanation: 'Cytokines are signalling molecules used by immune and support cells.',
      },
    ],
    xpReward: 24,
    coinReward: 9,
    masteryThreshold: 0.8,
  },
  {
    id: 'A38',
    trackId: 'neuroscience',
    moduleId: 'A-health',
    order: 38,
    title: 'Neurodegeneration',
    subtitle: 'When circuits lose cells and connections',
    estimatedMinutes: 6,
    difficulty: 'beginner',
    prerequisites: ['A12'],
    explanation:
      'Neurodegenerative diseases involve progressive loss of neuronal function, synapses, or cells. Different diseases target different circuits: dopamine systems in Parkinson disease, memory networks in Alzheimer disease, and motor neurons in ALS. Symptoms emerge from circuit failure, not just from a single damaged molecule.',
    keyTerms: ['neurodegeneration', 'synapse loss', 'circuit failure', 'protein aggregation'],
    example:
      'In Parkinson disease, loss of dopamine neurons disrupts basal ganglia loops that help select and initiate movement.',
    intuition:
      'A brain disorder can look like a network losing important bridges and support nodes over time.',
    whyItMatters:
      'Understanding circuits helps connect molecular pathology to real symptoms and treatment strategies.',
    questions: [
      {
        prompt: 'Neurodegeneration usually involves...',
        options: [
          'Progressive loss of neuronal function, synapses, or cells',
          'Instant perfect learning',
          'Only temporary boredom',
          'A normal increase in every synapse',
        ],
        answerIndex: 0,
        explanation: 'Neurodegenerative disorders progressively impair neurons and circuits.',
      },
      {
        prompt: 'Parkinson disease strongly affects...',
        options: ['Dopamine-related basal ganglia circuits', 'Only the retina', 'Only blood cells', 'Only skull bones'],
        answerIndex: 0,
        explanation: 'Parkinson disease is linked to degeneration of dopamine neurons that influence basal ganglia loops.',
      },
      {
        prompt: 'Why think about circuits in neurodegeneration?',
        options: [
          'Symptoms reflect failing networks, not isolated molecules alone',
          'Circuits are irrelevant to symptoms',
          'All diseases damage every region equally',
          'Synapses cannot be lost',
        ],
        answerIndex: 0,
        explanation: 'Circuit-level thinking helps explain which functions are affected and why.',
      },
    ],
    xpReward: 26,
    coinReward: 10,
    masteryThreshold: 0.8,
  },
  {
    id: 'A39',
    trackId: 'neuroscience',
    moduleId: 'A-health',
    order: 39,
    title: 'Psychiatric circuit disorders',
    subtitle: 'Mental health through interacting systems',
    estimatedMinutes: 6,
    difficulty: 'beginner',
    prerequisites: ['A18'],
    explanation:
      'Psychiatric disorders are not just problems in one brain spot. They involve interacting circuits for mood, threat, reward, attention, control, memory, sleep, and body state. Genes, development, stress, learning, social context, and inflammation can all shift these systems. Circuit thinking helps avoid overly simple explanations.',
    keyTerms: ['circuit disorder', 'mood network', 'reward circuit', 'cognitive control'],
    example:
      'Depression can involve changes in reward learning, sleep, stress hormones, rumination, body energy, and social behaviour together.',
    intuition:
      'Mental health is a systems problem: many loops can push each other toward stability or instability.',
    whyItMatters:
      'A circuit view supports more humane explanations and connects symptoms to multiple treatment routes.',
    questions: [
      {
        prompt: 'A circuit view of psychiatric disorders emphasises...',
        options: [
          'Interacting brain and body systems',
          'One isolated neuron as the full cause',
          'No role for learning or context',
          'Only skull shape',
        ],
        answerIndex: 0,
        explanation: 'Mental health symptoms often emerge from interacting networks and body systems.',
      },
      {
        prompt: 'Reward circuits are especially relevant to...',
        options: ['Motivation and reinforcement', 'Blood filtration only', 'Myelin thickness only', 'Skin colour'],
        answerIndex: 0,
        explanation: 'Reward circuits influence motivation, reinforcement learning, and action selection.',
      },
      {
        prompt: 'Why avoid one-cause explanations?',
        options: [
          'Psychiatric symptoms usually reflect many interacting mechanisms',
          'The brain has no interacting systems',
          'All symptoms are identical',
          'Context never affects the brain',
        ],
        answerIndex: 0,
        explanation: 'Genes, development, stress, learning, social context, and circuits can all contribute.',
      },
    ],
    xpReward: 26,
    coinReward: 10,
    masteryThreshold: 0.8,
  },
  {
    id: 'A40',
    trackId: 'neuroscience',
    moduleId: 'A-science',
    order: 40,
    title: 'Reading neuroscience evidence',
    subtitle: 'Claims, methods, and limits',
    estimatedMinutes: 6,
    difficulty: 'beginner',
    prerequisites: ['A20'],
    explanation:
      'A neuroscience claim is only as strong as the evidence behind it. Good reading asks: What was measured? At what scale? In which species or participants? Was the result correlational or causal? Are there controls, effect sizes, uncertainty, and replication? A strong paper usually has a clear method, a careful result, and modest conclusions.',
    keyTerms: ['evidence', 'correlation', 'causation', 'replication'],
    example:
      'If fMRI activity correlates with a behaviour, that does not prove the region causes the behaviour unless causal tests or converging evidence support it.',
    intuition:
      'Read each claim by tracing the chain from method to measurement to conclusion.',
    whyItMatters:
      'This skill protects students from overhyped brain claims and prepares them to interpret real research responsibly.',
    questions: [
      {
        prompt: 'A correlation between brain activity and behaviour proves...',
        options: [
          'Association, not causation by itself',
          'A complete causal mechanism immediately',
          'That no control is needed',
          'That the result applies to every species',
        ],
        answerIndex: 0,
        explanation: 'Correlation is informative but does not by itself establish causal necessity or sufficiency.',
      },
      {
        prompt: 'A careful neuroscience reader asks first...',
        options: [
          'What was measured and at what scale?',
          'Whether the figure is colourful',
          'Whether the title sounds exciting',
          'Whether the method can be ignored',
        ],
        answerIndex: 0,
        explanation: 'The measurement method defines what kind of inference is justified.',
      },
      {
        prompt: 'Replication matters because it...',
        options: [
          'Tests whether a finding is reliable beyond one study',
          'Makes controls unnecessary',
          'Turns correlation into causation automatically',
          'Removes the need for statistics',
        ],
        answerIndex: 0,
        explanation: 'Replication checks whether a result is robust across samples, labs, or methods.',
      },
    ],
    xpReward: 28,
    coinReward: 11,
    masteryThreshold: 0.8,
  },
];
