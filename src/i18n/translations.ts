import { frDictionary } from './frDictionary';

export type AppLanguage = 'en' | 'fr';

const manualFrench: Record<string, string> = {
  'Home': 'Accueil',
  'Learn': 'Apprendre',
  'Exam': 'Examen',
  'Progress': 'Progrès',
  'Profile': 'Profil',
  'English': 'Anglais',
  'French': 'Français',
  'Language': 'Langue',
  'Cancel': 'Annuler',
  'Reset': 'Réinitialiser',
  'App language': "Langue de l'application",
  'Choose the language used across the app.': "Choisis la langue utilisée dans toute l'application.",
  'Never': 'Jamais',
  'Locked': 'Verrouillé',
  'coins': 'pièces',
  'coin': 'pièce',
  'completed': 'terminé',
  'mastered': 'maîtrisé',
  'attempts': 'tentatives',
  'avg quiz': 'quiz moyen',
  'active days': 'jours actifs',
  'level': 'niveau',
  'success': 'réussite',
  'best': 'meilleur',
  'last seen': 'dernière activité',
  'last sync': 'dernière synchro',
  'Connection': 'Connexion',
  'Connection:': 'Connexion :',
  'Role:': 'Rôle :',
  'Last cloud sync:': 'Dernière synchro cloud :',
  'Signed in as': 'Connecté en tant que',
  'student': 'étudiant',
  'admin': 'admin',
  'Active today': "Actif aujourd'hui",
  'Active this week': 'Actif cette semaine',
  'Inactive': 'Inactif',
  'not_started': 'pas commencé',
  'beginner': 'débutant',
  'practicing': "en entraînement",
  'strong': 'solide',
  'TODAY': "AUJOURD'HUI",
  'QUESTS': 'QUÊTES',
  'MASTERED': 'MAÎTRISÉ',
  'YOUR COINS': 'TES PIÈCES',
  'COST': 'COÛT',
  'Overview': "Vue d'ensemble",
  'Students': 'Étudiants',
  'Lessons': 'Leçons',
  'Open larger illustration for': "Ouvrir l'illustration agrandie pour",
  'A vector of one-hots': 'Un vecteur binaire à position unique',
  'Without comfortable indexing, sums like Σ wᵢ rᵢ are hard to read. With it, they are just "weighted sums".':
    'Sans indices clairs, des expressions comme Σ wᵢ rᵢ deviennent difficiles à lire. Avec les indices, on voit simplement une somme pondérée.',
  'Every spike begins from rest. Computational models start with a resting state and ask how inputs push it toward threshold.':
    "Chaque potentiel d'action part du potentiel de repos. Les modèles computationnels commencent par cet état de repos et demandent comment les entrées le rapprochent du seuil.",
  'Fire action potentials': "Déclencher des potentiels d'action",
  'An action potential is a short, stereotyped voltage burst. Once the membrane crosses threshold, voltage-gated sodium channels open and the interior flips positive. Potassium channels then open and the voltage returns, even overshooting briefly before settling.':
    "Un potentiel d'action est une brève variation stéréotypée du potentiel de membrane. Quand la membrane franchit le seuil, les canaux sodium dépendants du potentiel s'ouvrent et l'intérieur devient positif. Les canaux potassium s'ouvrent ensuite, ce qui repolarise la membrane, parfois avec une brève hyperpolarisation.",
  'A single cortical neuron may spike only a few times per second on average, but each spike is a crisp, all-or-none event lasting about a millisecond.':
    "Un neurone cortical peut n'émettre que quelques potentiels d'action par seconde en moyenne, mais chaque événement est net, tout ou rien, et dure environ une milliseconde.",
  'Neurons talk in spikes. Modelling spikes lets us study how information hops between cells in real time.':
    "Les neurones communiquent par potentiels d'action. Les modéliser permet d'étudier comment l'information passe d'une cellule à l'autre en temps réel.",
  'Either threshold is crossed and a full spike fires, or nothing happens.':
    "Soit le seuil est franchi et un potentiel d'action complet est émis, soit il ne se passe rien.",
  'After a spike, the cell cannot immediately fire again, enforcing a maximum firing rate.':
    "Après un potentiel d'action, la cellule ne peut pas en émettre immédiatement un autre, ce qui impose une fréquence maximale de décharge.",
  'When a spike arrives at an axon terminal, calcium enters and vesicles fuse with the membrane, releasing neurotransmitter into a narrow gap. The molecules bind to receptors on the receiving cell and briefly change its membrane conductance, nudging it toward or away from firing.':
    "Quand un potentiel d'action arrive à une terminaison axonale, le calcium entre et les vésicules fusionnent avec la membrane, libérant un neurotransmetteur dans la fente synaptique. Les molécules se lient aux récepteurs de la cellule cible et modifient brièvement sa conductance membranaire, ce qui la rapproche ou l'éloigne du seuil.",
  'At a hippocampal synapse, a spike can release glutamate in under a millisecond, producing a tiny postsynaptic response just a few millivolts high.':
    "Dans une synapse hippocampique, un potentiel d'action peut libérer du glutamate en moins d'une milliseconde et produire une petite réponse postsynaptique de quelques millivolts.",
  'Excitatory synapses push the receiving neuron closer to firing threshold. Inhibitory synapses pull it further away. Most cortical microcircuit balance is maintained by a mixture of both acting on the same cells.':
    "Les synapses excitatrices rapprochent le neurone postsynaptique du seuil. Les synapses inhibitrices l'en éloignent ou diminuent l'effet des entrées excitatrices. L'équilibre des microcircuits corticaux dépend du mélange précis des deux sur les mêmes cellules.",
  'Excitatory synapses push the receiving neuron closer to its firing threshold. Inhibitory synapses push it further away. Most of the balance in a cortical microcircuit is maintained by a mix of both acting on the same cells.':
    "Les synapses excitatrices rapprochent le neurone postsynaptique du seuil. Les synapses inhibitrices l'en éloignent ou diminuent l'effet des entrées excitatrices. L'équilibre d'un microcircuit cortical dépend du mélange précis des deux sur les mêmes cellules.",
  'Push the spike closer, pull it away': "Rapprocher ou éloigner du seuil",
  'Firing action potentials at high rates': "Émettre des potentiels d'action à haute fréquence",
  'One that maximises its firing': "Celui qui maximise sa fréquence de décharge",
  'Models of attention combine gain control, gating, and working memory loops.':
    "Les modèles de l'attention combinent modulation du gain, sélection des signaux et boucles de mémoire de travail.",
  'A receptive field of a sensory neuron is the region of the world where a stimulus changes its firing rate. In vision it is a patch on the retina. In touch it is a patch of skin. In audition it is a range of frequencies.':
    "Le champ récepteur d'un neurone sensoriel est la partie du monde où un stimulus modifie sa fréquence de décharge. En vision, c'est une zone de la rétine. En somesthésie, c'est une zone de peau. En audition, c'est une gamme de fréquences.",
  'Each sensory neuron asks a tiny question and answers with its firing rate.':
    "Chaque neurone sensoriel pose une petite question et répond par sa fréquence de décharge.",
  'The firing rate of one neuron': "La fréquence de décharge d'un neurone",
  'A component of a firing-rate vector is typically...': "Une composante d'un vecteur de fréquences de décharge est généralement...",
  'A motor neuron whose firing rate drives muscle force.': "Un motoneurone dont la fréquence de décharge contrôle la force musculaire.",
  'Motor neurons in the spinal cord directly drive muscles, while motor cortex, cerebellum, and basal ganglia plan and refine movements. The final common path is always the motor neuron, whose firing rate determines muscle force.':
    "Les motoneurones de la moelle épinière activent directement les muscles, tandis que le cortex moteur, le cervelet et les noyaux gris centraux planifient et affinent les mouvements. La voie finale commune reste le motoneurone, dont la fréquence de décharge détermine la force musculaire.",
  'Thought becomes action only through the spikes of a motor neuron.':
    "La pensée ne devient action qu'à travers les potentiels d'action des motoneurones.",
  'If r is a population rate vector, r₅ is the firing rate of the fifth neuron in the population.':
    "Si r est un vecteur de fréquences de décharge d'une population, r₅ est la fréquence de décharge du cinquième neurone.",
  'If rᵢ is the firing rate of neuron i, then r₃ is simply the firing rate of the third neuron in your recording.':
    "Si rᵢ est la fréquence de décharge du neurone i, alors r₃ est simplement la fréquence de décharge du troisième neurone de ton enregistrement.",
  'If rᵢ is the firing rate of the i-th neuron, then r₁ + r₂ is...':
    "Si rᵢ est la fréquence de décharge du neurone i, alors r₁ + r₂ est...",
  'The sum of the first two neurons’ firing rates': "La somme des fréquences de décharge des deux premiers neurones",
  'If r(t) is a firing-rate vector over time, then r(t) is...':
    "Si r(t) est un vecteur de fréquences de décharge au cours du temps, alors r(t) est...",
  'At each instant, r(t) is a vector of firing rates.':
    "À chaque instant, r(t) est un vecteur de fréquences de décharge.",
  'If r is the vector of 200 presynaptic firing rates and W is a 100 × 200 weight matrix, then W r is the vector of 100 weighted summed inputs to postsynaptic neurons.':
    "Si r est le vecteur des fréquences de décharge de 200 neurones présynaptiques et W une matrice de poids 100 × 200, alors W r donne les 100 entrées pondérées reçues par les neurones postsynaptiques.",
  'y = W r is "every postsynaptic neuron does its own weighted sum, all at the same time".':
    'y = W r signifie que chaque neurone postsynaptique calcule sa propre somme pondérée, tous en parallèle.',
  'Each output entry is one postsynaptic neuron’s weighted sum of inputs.':
    "Chaque composante de sortie est la somme pondérée des entrées d'un neurone postsynaptique.",
  'A weighted sum multiplies each component of a vector by a weight and adds the results. Σᵢ wᵢ xᵢ is how neurons combine their inputs, how we score decisions, and how most linear features of neural models work.':
    "Une somme pondérée multiplie chaque composante d'un vecteur par son poids, puis additionne les résultats. L'expression Σᵢ wᵢ xᵢ décrit comment un neurone combine ses entrées, comment un modèle linéaire construit un score et comment de nombreuses projections neuronales sont calculées.",
  'A postsynaptic neuron computes u = Σᵢ wᵢ rᵢ where wᵢ is its synaptic strength from neuron i and rᵢ is that neuron’s firing rate.':
    "Un neurone postsynaptique peut calculer u = Σᵢ wᵢ rᵢ, où wᵢ est le poids synaptique venant du neurone i et rᵢ sa fréquence de décharge.",
  'A weighted sum is a vote where each voter has their own volume.':
    "Une somme pondérée ressemble à un vote où chaque entrée parle avec une intensité différente.",
  'A function takes an input and produces exactly one output. Writing f(x) = y means: give me an x, I give you back a y. Neurons can be thought of as functions mapping inputs to firing rates.':
    "Une fonction prend une entrée et produit exactement une sortie. Écrire f(x) = y signifie: donne-moi x, je renvoie y. On peut voir un neurone comme une fonction qui transforme des entrées synaptiques en fréquence de décharge.",
  'A simple firing-rate model is r = f(u), where u is a weighted input and f is a saturating nonlinearity like a sigmoid.':
    "Un modèle simple de fréquence de décharge s'écrit r = f(u), où u est une entrée pondérée et f une non-linéarité saturante, par exemple une sigmoïde.",
  'A neuron with mean firing rate 10 Hz and variance 10 spikes² has a Fano factor of 1, consistent with a Poisson process.':
    "Un neurone dont le nombre de potentiels d'action a une moyenne de 10 et une variance de 10 possède un facteur de Fano égal à 1, comme dans un processus de Poisson.",
  'A Gaussian (normal) random variable has density ∝ exp(−(x−μ)² / 2σ²). It is fully specified by its mean μ and variance σ². Sums of many small independent contributions tend toward a Gaussian, the central limit theorem.':
    "Une variable aléatoire gaussienne, ou normale, a une densité proportionnelle à exp(−(x−μ)² / 2σ²). Elle est entièrement définie par sa moyenne μ et sa variance σ². D'après le théorème central limite, la somme de nombreuses petites contributions indépendantes tend vers une loi gaussienne.",
  'A leaky integrate-and-fire neuron integrates its inputs through a leaky membrane and emits a spike whenever the voltage crosses a threshold. After a spike, the voltage is reset. It captures the essential “charge up, fire, reset” rhythm of a real neuron with just one equation.':
    "Un neurone intégrateur à fuite additionne ses entrées à travers une membrane qui laisse fuir le courant et émet un potentiel d'action lorsque le potentiel de membrane franchit un seuil. Après l'émission, le potentiel est réinitialisé. Ce modèle capture le cycle essentiel charger, décharger, réinitialiser avec une seule équation.",
  'Charge a leaky bucket. Every time it overflows, mark a spike and start again.':
    "Remplis un seau percé. Chaque fois qu'il déborde, on note un potentiel d'action et on recommence.",
  'Because the membrane leaks spikes': "Parce que la membrane laisse fuir les potentiels d'action",
  'A spike is recorded and V is reset': "Un potentiel d'action est enregistré et V est réinitialisé",
  'The model emits a spike and resets V to V_reset.':
    "Le modèle émet un potentiel d'action et réinitialise V à V_reset.",
  'Given a larger constant input, the LIF firing rate...':
    "Avec une entrée constante plus grande, la fréquence de décharge du modèle LIF...",
  'A tuning curve plots a neuron’s mean firing rate as a function of a stimulus feature. Many neurons have a peak at a preferred value and decrease for values away from it, so the curve looks like a hill.':
    "Une courbe d'accord représente la fréquence moyenne de décharge d'un neurone en fonction d'une caractéristique du stimulus. Beaucoup de neurones répondent maximalement autour d'une valeur préférée, puis moins fortement quand on s'en éloigne.",
  'Firing rate vs stimulus feature': "Fréquence de décharge en fonction d'une caractéristique du stimulus",
  'A spike train can be modelled as a stochastic point process. If spikes are independent with an instantaneous rate λ(t), this is called an inhomogeneous Poisson process. The likelihood of a spike in a tiny window Δt is approximately λ(t)Δt.':
    "Un train de potentiels d'action peut être modélisé comme un processus ponctuel stochastique. Si les événements sont indépendants avec une intensité instantanée λ(t), on parle de processus de Poisson inhomogène. La probabilité d'observer un potentiel d'action dans une petite fenêtre Δt vaut environ λ(t)Δt.",
  'Many early retinal models describe ganglion cell firing as a Poisson process with rate driven by a linear filter of the stimulus.':
    "De nombreux premiers modèles de rétine décrivent la décharge des cellules ganglionnaires comme un processus de Poisson dont l'intensité est pilotée par un filtre linéaire du stimulus.",
  'Imagine a faucet whose drip rate varies over time. Each drip is a spike.':
    "Imagine un robinet dont le débit varie au cours du temps. Chaque goutte correspond à un potentiel d'action.",
  'Homeostatic plasticity mechanisms adjust synaptic strengths or intrinsic excitability to keep a neuron’s average firing near a target. This prevents pure Hebbian learning from driving activity to zero or to runaway firing.':
    "Les mécanismes de plasticité homéostatique ajustent les forces synaptiques ou l'excitabilité intrinsèque pour garder la décharge moyenne d'un neurone près d'une cible. Ils empêchent un apprentissage purement hebbien de pousser l'activité vers zéro ou vers une excitation incontrôlée.",
  'In cortex, excitation and inhibition are roughly balanced, producing irregular firing patterns and allowing fast responses. Too much excitation makes activity explode; too much inhibition silences the network.':
    "Dans le cortex, excitation et inhibition sont approximativement équilibrées. Cet équilibre produit des patrons de décharge irréguliers tout en permettant des réponses rapides. Trop d'excitation emballe l'activité; trop d'inhibition réduit le réseau au silence.",
  'Balanced recurrent networks reproduce the highly irregular, Poisson-like spiking seen in real cortical neurons.':
    "Les réseaux récurrents équilibrés reproduisent la décharge très irrégulière, proche de Poisson, observée dans de vrais neurones corticaux.",
  'A neuron in balance is always one nudge away from firing - fast, sensitive, and never runaway.':
    "Un neurone équilibré reste proche du seuil: rapide, sensible, mais pas instable.",
  'Coordinated firing across neurons': "Décharges coordonnées entre neurones",
  'Random firing only': "Décharges aléatoires uniquement",
  'Neural synchrony refers to...': "La synchronie neuronale désigne...",
  'Theta rhythms in hippocampus help organise place cell firing in time and are linked to memory encoding.':
    "Les rythmes thêta de l'hippocampe aident à organiser temporellement la décharge des cellules de lieu et sont liés à l'encodage mnésique.",
  'The Hodgkin-Huxley equations describe the action potential by tracking voltage together with three gating variables m, h, n that govern voltage-dependent sodium and potassium conductances. Their interplay produces the rapid depolarisation and slower repolarisation of a real spike.':
    "Les équations de Hodgkin-Huxley décrivent le potentiel d'action en suivant le potentiel de membrane et trois variables de porte, m, h et n, qui gouvernent les conductances sodium et potassium dépendantes du voltage. Leur interaction produit la dépolarisation rapide et la repolarisation plus lente d'un vrai potentiel d'action.",
  'Hodgkin-Huxley uses gating variables to describe...':
    "Hodgkin-Huxley utilise des variables de porte pour décrire...",
  'gating variable': 'variable de porte',
  'gating kinetics': "cinétique d'ouverture des canaux",
  'Each gating variable obeys a first-order kinetic equation dm/dt = α(V)(1 − m) − β(V) m, where α and β are voltage-dependent rates. Equivalently, m relaxes toward a steady state m_∞(V) with a voltage-dependent time constant τ_m(V).':
    "Chaque variable de porte obéit à une équation cinétique du premier ordre, dm/dt = α(V)(1 − m) − β(V)m, où α et β sont des taux dépendants du voltage. De façon équivalente, m se relaxe vers un état stationnaire m_∞(V) avec une constante de temps τ_m(V) dépendante du voltage.",
  'Channel kinetics determine spike shape, refractoriness, and the menagerie of neuron firing types.':
    "La cinétique des canaux détermine la forme des potentiels d'action, la réfractarité et la diversité des classes d'excitabilité neuronale.",
  'A diversity of firing patterns and excitability classes':
    "Une diversité de patrons de décharge et de classes d'excitabilité",
  'A depressing synapse weakens during sustained presynaptic firing, acting like a high-pass temporal filter.':
    "Une synapse déprimante s'affaiblit pendant une décharge présynaptique soutenue et agit comme un filtre temporel passe-haut.",
  'Mean firing rates of coupled excitatory and inhibitory populations':
    "Fréquences moyennes de décharge de populations excitatrices et inhibitrices couplées",
  'Find where the arrows on the plane stop moving - those are fixed points.':
    "Repère où les flèches du plan cessent de bouger: ce sont les points fixes.",
  'No firing': "Pas de décharge",
  'It is the canonical computational model of two-alternative decisions and links neural firing to behaviour.':
    "C'est le modèle computationnel canonique des décisions à deux alternatives, reliant la décharge neuronale au comportement.",
  'Every wire in the brain, traced by a network.':
    "Chaque connexion du cerveau, reconstruite par un réseau.",
  'Reinforcement learning theory has an unusually deep partnership with neuroscience. Dopamine neuron firing approximates a reward prediction error signal, and basal ganglia circuits are interpreted as actor-critic systems learning from those errors.':
    "La théorie de l'apprentissage par renforcement entretient un lien particulièrement profond avec les neurosciences. La décharge des neurones dopaminergiques approxime un signal d'erreur de prédiction de récompense, et les circuits des noyaux gris centraux sont interprétés comme des systèmes acteur-critique qui apprennent à partir de ces erreurs.",
  'A spike of dopamine = "better than expected".':
    'Une bouffée phasique de dopamine = "mieux que prévu".',
  'Their phasic firing tracks RPE.': "Leur décharge phasique suit l'erreur de prédiction de récompense.",
  'Their phasic firing closely matches reward prediction errors.':
    "Leur décharge phasique correspond étroitement aux erreurs de prédiction de récompense.",
  'Within a very short time window, we can treat the presence of a spike as a binary event: 1 if it fires, 0 if it does not. If the probability of firing is p, this is a Bernoulli random variable with mean p.':
    "Dans une fenêtre temporelle très courte, on peut traiter la présence d'un potentiel d'action comme un événement binaire: 1 s'il est émis, 0 sinon. Si la probabilité d'émission est p, on obtient une variable aléatoire de Bernoulli de moyenne p.",
  'In a 1 ms bin, a neuron either spiked (1) or did not (0). Across many trials, the mean of these binary outcomes estimates spike probability p.':
    "Dans un intervalle de 1 ms, un neurone a soit émis un potentiel d'action (1), soit rien émis (0). Sur de nombreux essais, la moyenne de ces valeurs binaires estime la probabilité p.",
  'A dataset is a collection of examples. Each example has features (the inputs the model sees) and, in supervised learning, a label (the target answer). Good features and clean labels matter more than fancy models.':
    "Un jeu de données est une collection d'exemples. Chaque exemple contient des caractéristiques, c'est-à-dire les entrées vues par le modèle, et en apprentissage supervisé une étiquette, c'est-à-dire la réponse cible. De bonnes caractéristiques et des étiquettes fiables comptent plus qu'un modèle sophistiqué.",
  'A feature is...': "Une caractéristique est...",
  'The features within an example': "Les caractéristiques d'un exemple",
  'A 2D plane': 'Un plan 2D',
  'A plane': 'Un plan',
  'feature': 'caractéristique',
  'features': 'caractéristiques',
  'firing rate': 'fréquence de décharge',
  'spike train': "train de potentiels d'action",
  'spike count': "nombre de potentiels d'action",
  'spike sorting': "tri des potentiels d'action",
  'The all-or-none spike': "Le signal tout ou rien",
  'Push the spike, pull it back': "Rapprocher du seuil, puis freiner",
  'A spike arrives at the axon terminal': "Un potentiel d'action arrive à la terminaison axonale",
  'The voltage at which a spike fires': "Le potentiel de membrane auquel un potentiel d'action est déclenché",
  'Single spikes': "Potentiels d'action isolés",
  'Measures single spike timing perfectly': "Mesure parfaitement le moment d'un potentiel d'action isolé",
  'A single spike': "Un potentiel d'action isolé",
  'A single spike train': "Un train de potentiels d'action",
  'Recordings of a single spike': "Enregistrements d'un potentiel d'action isolé",
  'A binary spike and Bernoulli': "Événement binaire et loi de Bernoulli",
  'Binary spike and Bernoulli': "Événement binaire et Bernoulli",
  'In a 1 ms bin, a neuron either spiked (1) or did not (0). Over many trials, the average of these binary outcomes estimates the spike probability p.':
    "Dans un intervalle de 1 ms, un neurone a soit émis un potentiel d'action (1), soit rien émis (0). Sur de nombreux essais, la moyenne de ces valeurs binaires estime la probabilité p.",
  'Estimating p from spike data uses...': "Pour estimer p à partir de données de décharge, on utilise...",
  'You estimate p as the empirical fraction of trials with a spike.':
    "On estime p par la fraction empirique des essais où un potentiel d'action est observé.",
  'Spike counts and Poisson': "Comptage des potentiels d'action et loi de Poisson",
  'Counting spikes in bigger windows': "Compter les potentiels d'action dans des fenêtres plus longues",
  'A Poisson distribution describes the number of independent events in a fixed interval given an average rate λ. Spike counts from neurons are often approximated as Poisson for simplicity. Its mean and variance both equal λ.':
    "Une loi de Poisson décrit le nombre d'événements indépendants dans un intervalle fixé, pour une intensité moyenne λ. Le nombre de potentiels d'action émis par un neurone est souvent approximé par une loi de Poisson. Sa moyenne et sa variance valent toutes deux λ.",
  'If a neuron fires about 5 spikes on average per 100 ms window, a Poisson(5) distribution gives a rough baseline model of its spike counts.':
    "Si un neurone émet en moyenne 5 potentiels d'action par fenêtre de 100 ms, une loi de Poisson(5) donne un modèle de référence approximatif pour ce comptage.",
  'Noisy spike-count models': "Modèles bruités de comptage neuronal",
  'Independent random spikes in a fixed window': "Événements indépendants et aléatoires dans une fenêtre fixée",
  'The gradient ∇f points in the direction of...': "Le gradient ∇f indique la direction de...",
  'Leaky integrate-and-fire neuron': "Neurone intégrateur à fuite",
  'The simplest spiking neuron model': "Le plus simple modèle de neurone à potentiels d'action",
  'Charge a leaky bucket. Every time it overflows, you mark a spike and start again.':
    "Remplis un seau percé. À chaque débordement, on note un potentiel d'action et on recommence.",
  'Given a constant input current, an LIF neuron fires regularly at a rate determined by how quickly its voltage reaches threshold.':
    "Avec un courant d'entrée constant, un neurone LIF émet régulièrement des potentiels d'action à une fréquence déterminée par la vitesse à laquelle son potentiel atteint le seuil.",
  'A simple leaky neuron relaxes toward its resting potential whenever no input is present.':
    "Un neurone à fuite revient vers son potentiel de repos lorsqu'aucune entrée n'est présente.",
  'For a leaky membrane, V alone is enough to predict the future.':
    "Pour une membrane à fuite, V suffit à prédire l'évolution future.",
  'Bigger τ means slower decay, so inputs accumulate for longer.':
    "Un τ plus grand signifie une décroissance plus lente, donc les entrées s'accumulent plus longtemps.",
  'Replacing spikes with smooth rates': "Remplacer les potentiels d'action par une fréquence moyenne",
  'Firing rate models': "Modèles de fréquence de décharge",
  'Rate models are easier to handle than spike models and still capture population-level behaviour.':
    "Les modèles de fréquence de décharge sont plus simples à manipuler que les modèles à potentiels d'action et capturent souvent le comportement d'une population.",
  'Take a weighted sum of recent inputs, exponentiate, and use it as a spike rate.':
    "On calcule une somme pondérée des entrées récentes, on l'exponentie, puis on l'utilise comme intensité d'émission des potentiels d'action.",
  'A spike-history filter': "Un filtre d'historique de décharge",
  'GLMs are the workhorse statistical tool for modelling real neural firing.':
    "Les GLM sont un outil statistique central pour modéliser la décharge neuronale réelle.",
  'The first quantitative spike': "Le premier modèle quantitatif du potentiel d'action",
  'Hodgkin and Huxley fit their model to the squid giant axon and reproduced spike shape, threshold, and refractory period from first principles.':
    "Hodgkin et Huxley ont ajusté leur modèle sur l'axone géant du calmar et ont reproduit la forme du potentiel d'action, son seuil et sa période réfractaire à partir de principes biophysiques.",
  'Voltage opens channels, channels change voltage; the spike is the dance.':
    "Le potentiel de membrane ouvre les canaux, les canaux modifient le potentiel: le potentiel d'action naît de cette boucle.",
  'Dendrites are leaky cables: voltage decays with distance from a synaptic input due to membrane resistance and intracellular axial resistance. The cable equation describes how voltage spreads, with characteristic length λ and time τ that depend on these resistances.':
    "Les dendrites sont des câbles à fuite: le potentiel décroît avec la distance à l'entrée synaptique à cause de la résistance membranaire et de la résistance axiale intracellulaire. L'équation du câble décrit cette propagation avec une longueur caractéristique λ et une constante de temps τ.",
  'Leaky electrical cable': "Câble électrique à fuite",
  'The threshold of a spike': "Le seuil d'émission d'un potentiel d'action",
  'How much do exact spike times matter?': "À quel point le moment exact des potentiels d'action compte-t-il?",
  'The exact number of spikes from the neuron': "Le nombre exact de potentiels d'action du neurone",
  'The mean stimulus that precedes spikes': "Le stimulus moyen qui précède les potentiels d'action",
  'STA means spike-triggered average.': "STA signifie moyenne déclenchée par les potentiels d'action.",
  'Spikes matter': "Le moment des potentiels d'action compte",
  'Diagnosing spike train variability': "Diagnostiquer la variabilité des trains de potentiels d'action",
  'Future spikes only': "Potentiels d'action futurs uniquement",
  'Local time-window patterns in spike trains': "Motifs temporels locaux dans les trains de potentiels d'action",
  'A spike sorter': "Un algorithme de tri des potentiels d'action",
  'Spike sorter only': "Algorithme de tri des potentiels d'action seulement",
  'A masked autoencoder trained on millions of spike-train segments yields embeddings that improve decoding on small new datasets.':
    "Un auto-encodeur masqué entraîné sur des millions de segments de trains de potentiels d'action produit des représentations qui améliorent le décodage sur de petits jeux de données nouveaux.",
  'Better embeddings that transfer to small labelled tasks':
    "De meilleures représentations, transférables vers de petites tâches étiquetées",
  'Masked prediction in spike data resembles...':
    "La prédiction masquée dans des données de potentiels d'action ressemble à...",
  'Train spike sorters': "Entraîner des algorithmes de tri des potentiels d'action",
  'Spike when expectations are violated': "S'activent lorsque les attentes sont violées",
  'Mismatch responses fit predictive coding because they...':
    "Les réponses de mismatch correspondent au codage prédictif parce qu'elles...",
  'Mapping model activations to voxel responses': "Associer les activations du modèle aux réponses des voxels",
  'A linear filter on motor cortex spikes is enough to predict cursor velocity in many BCI experiments.':
    "Dans de nombreuses expériences de BCI, un filtre linéaire appliqué aux potentiels d'action du cortex moteur suffit à prédire la vitesse du curseur.",
  'Mouse paw positions tracked at 60 frames per second can be aligned with neural spikes to study motor learning.':
    "Les positions des pattes d'une souris suivies à 60 images par seconde peuvent être alignées sur la décharge neuronale pour étudier l'apprentissage moteur.",
  'A VAE trained on motor cortex spikes can generate plausible synthetic trials for benchmarking decoders.':
    "Un VAE entraîné sur l'activité du cortex moteur peut générer des essais synthétiques plausibles pour évaluer des décodeurs.",
  'Axon terminals convert an electrical spike into a synaptic signal by releasing transmitter onto a target cell.':
    "Les terminaisons axonales convertissent un potentiel d'action en signal synaptique en libérant un neurotransmetteur vers une cellule cible.",
  'Ca2+ entry makes synaptic vesicles fuse with the presynaptic membrane, releasing transmitter into the cleft.':
    "L'entrée de Ca2+ fait fusionner les vésicules synaptiques avec la membrane présynaptique, ce qui libère un neurotransmetteur dans la fente synaptique.",
  'Postsynaptic receptors translate transmitter binding into ion flow or intracellular signaling.':
    "Les récepteurs postsynaptiques transforment la liaison du neurotransmetteur en flux ionique ou en signalisation intracellulaire.",
  'Glutamate is the dominant excitatory transmitter in the vertebrate CNS.':
    "Le glutamate est le principal neurotransmetteur excitateur rapide du système nerveux central des vertébrés.",
  'GABA is the major fast inhibitory transmitter in most mature CNS circuits.':
    "Le GABA est le principal neurotransmetteur inhibiteur rapide dans la plupart des circuits matures du système nerveux central.",
  'A transmitter is defined by synthesis in the neuron, release from terminals, receptor action, and a mechanism for removal or breakdown.':
    "Une substance est considérée comme neurotransmetteur si elle est synthétisée par le neurone, libérée par ses terminaisons, agit sur des récepteurs et possède un mécanisme d'élimination ou de dégradation.",
  'Glutamate is the main fast excitatory transmitter in much of the brain, while GABA is the main fast inhibitory transmitter.':
    "Le glutamate est le principal neurotransmetteur excitateur rapide dans une grande partie du cerveau, tandis que le GABA est le principal neurotransmetteur inhibiteur rapide.",
  'The same transmitter can have different effects depending on receptor type and target cell.':
    "Un même neurotransmetteur peut avoir des effets différents selon le type de récepteur et la cellule cible.",
  'Co-release means one neuron can release more than one transmitter, often combining a fast small molecule with a slower modulator or peptide.':
    "La co-libération signifie qu'un même neurone peut libérer plusieurs messagers chimiques, souvent une petite molécule rapide et un modulateur ou peptide plus lent.",
  'A fast classical transmitter plus a slower peptide': "Un neurotransmetteur classique rapide et un peptide plus lent",
  'Many neurons can release a classical transmitter plus a peptide or another modulator.':
    "De nombreux neurones peuvent libérer un neurotransmetteur classique avec un peptide ou un autre modulateur.",
  'Many co-releasing neurons combine a fast transmitter with a slower neuromodulatory signal.':
    "De nombreux neurones à co-libération combinent un neurotransmetteur rapide avec un signal neuromodulateur plus lent.",
  'It lets terminals keep releasing transmitter':
    "Cela permet aux terminaisons de continuer à libérer des neurotransmetteurs",
  'It means transmitters never bind receptors':
    "Cela signifierait que les neurotransmetteurs ne se lient jamais aux récepteurs",
  'Astrocytes buffer ions and recycle transmitters so synapses stay reliable.':
    "Les astrocytes tamponnent les ions et recyclent les neurotransmetteurs, ce qui aide les synapses à rester fiables.",
  'Astrocytes regulate extracellular ions, help recycle transmitters, and support synaptic metabolism.':
    "Les astrocytes régulent les ions extracellulaires, aident à recycler les neurotransmetteurs et soutiennent le métabolisme synaptique.",
  'Glial cells outnumber neurons in many brain regions. Astrocytes regulate ions and neurotransmitters around synapses. Oligodendrocytes and Schwann cells wrap axons in myelin. Microglia patrol for damage and prune unused connections.':
    "Dans de nombreuses régions du cerveau, les cellules gliales sont plus nombreuses que les neurones. Les astrocytes régulent les ions et les neurotransmetteurs autour des synapses. Les oligodendrocytes et les cellules de Schwann entourent les axones de myéline. La microglie surveille les lésions et élague les connexions inutilisées.",
  'Thalamic circuits produce slow rhythms and reduce feedforward flow during deep sleep.':
    "Pendant le sommeil profond, les circuits thalamiques produisent des rythmes lents et réduisent le flux d'information vers le cortex.",
  'Basal ganglia and action selection': "Noyaux gris centraux et sélection de l'action",
  'Easier action initiation': "Initiation de l'action facilitée",
  'Amygdala outputs influence autonomic responses, attention, memory, and defensive behavior.':
    "Les sorties de l'amygdale influencent les réponses autonomes, l'attention, la mémoire et les comportements défensifs.",
  'BOLD signal': 'signal BOLD',
  'Signal BOLD': 'signal BOLD',
  'The main excitatory transmitter in cortex is...':
    'Le principal neurotransmetteur excitateur du cortex est...',
  'Excitation and inhibition describe the postsynaptic effect, not a permanent label for a transmitter in every circuit.':
    "L'excitation et l'inhibition décrivent l'effet postsynaptique, pas une étiquette permanente attachée à un neurotransmetteur.",
  'Neurotransmitters are the chemicals neurons use to talk. Glutamate is the dominant fast excitatory transmitter in the central nervous system, and GABA is the dominant fast inhibitory transmitter in the mature brain. Other transmitters act more broadly, tuning circuits: dopamine, serotonin, norepinephrine, acetylcholine, and many neuropeptides. A single neuron can also co-release more than one transmitter, so a synapse can send a fast signal and a slower modulatory signal together.':
    "Les neurotransmetteurs sont les molécules chimiques utilisées par les neurones pour communiquer. Le glutamate est le principal neurotransmetteur excitateur rapide du système nerveux central, et le GABA le principal neurotransmetteur inhibiteur rapide du cerveau mature. D'autres messagers agissent plus largement en modulant les circuits: dopamine, sérotonine, noradrénaline, acétylcholine et nombreux neuropeptides. Un même neurone peut aussi co-libérer plusieurs messagers, ce qui permet à une synapse d'envoyer à la fois un signal rapide et un signal modulateur plus lent.",
  'Some transmitters send a message. Others set the mood.':
    "Certains neurotransmetteurs transmettent un message précis. D'autres modulent l'état du circuit.",
  'One neuron can release more than one transmitter':
    "Un neurone peut libérer plusieurs neurotransmetteurs",
  'Transmitters cross the membrane without vesicles':
    "Les neurotransmetteurs traversent la membrane sans vésicules",
  'Some neurons release more than one chemical messenger. A terminal may release a fast classical transmitter such as glutamate, GABA, or acetylcholine, and also release a peptide or another modulator when activity is strong or sustained. Co-release lets the same neuron speak on multiple time scales: a fast postsynaptic potential can carry the immediate signal, while a slower transmitter changes excitability, plasticity, or network state.':
    "Certains neurones libèrent plusieurs messagers chimiques. Une terminaison peut libérer un neurotransmetteur classique rapide, comme le glutamate, le GABA ou l'acétylcholine, mais aussi un peptide ou un autre modulateur lorsque l'activité est forte ou soutenue. La co-libération permet au même neurone d'agir sur plusieurs échelles de temps: un potentiel postsynaptique rapide porte le signal immédiat, tandis qu'un messager plus lent modifie l'excitabilité, la plasticité ou l'état du réseau.",
  'A hypothalamic neuron can use a small molecule transmitter for fast synaptic effects and release a neuropeptide during bursts to influence broader circuit state.':
    "Un neurone hypothalamique peut utiliser un neurotransmetteur de petite taille pour des effets synaptiques rapides et libérer un neuropeptide pendant les bouffées d'activité afin d'influencer l'état plus global du circuit.",
  'Co-release prevents an oversimplified one-neuron-one-transmitter view and helps explain why the same circuit can behave differently during bursts, stress, hunger, or attention.':
    "La co-libération évite la vision trop simpliste un neurone, un neurotransmetteur, et aide à expliquer pourquoi un même circuit peut se comporter différemment pendant les bouffées d'activité, le stress, la faim ou l'attention.",
  'classical transmitter': 'neurotransmetteur classique',
  'Fast transmitters usually act within milliseconds, while peptides and many modulators can act over seconds or longer.':
    "Les neurotransmetteurs rapides agissent généralement en quelques millisecondes, tandis que les peptides et de nombreux modulateurs peuvent agir pendant des secondes ou davantage.",
  'A receptor tells the cell how to interpret a transmitter, which is why receptor subtype matters.':
    "Un récepteur indique à la cellule comment interpréter un neurotransmetteur, ce qui explique pourquoi le sous-type de récepteur compte.",
  'Regulating ions and transmitters around synapses':
    'Réguler les ions et les neurotransmetteurs autour des synapses',
  'Spikes, synaptic transmission, transmitter recycling, and membrane pumps all consume ATP.':
    "Les potentiels d'action, la transmission synaptique, le recyclage des neurotransmetteurs et les pompes membranaires consomment tous de l'ATP.",
  'Red blood cell spikes': 'Prolongements de globules rouges',
  'A narrow curve means sharp selectivity; a broad one means coarse tuning.':
    "Une courbe étroite indique une forte sélectivité; une courbe large indique un accord moins précis.",
  'How selective or broad the neuron is':
    "Le degré de sélectivité du neurone",
  'Convolution slides a filter (a short signal) across a longer one and computes local weighted sums. Low-pass filters smooth; high-pass filters emphasise fast changes; a linear receptive field acts like a filter applied to the stimulus.':
    "La convolution fait glisser un filtre, c'est-à-dire un signal court, le long d'un signal plus long et calcule des sommes pondérées locales. Un filtre passe-bas lisse le signal; un filtre passe-haut accentue les changements rapides; un champ récepteur linéaire agit comme un filtre appliqué au stimulus.",
  'Low-pass filtering a signal...': "Filtrer un signal en passe-bas...",
  'Smooths out fast fluctuations': "Lisse les fluctuations rapides",
  'h is the filter kernel being convolved against x.':
    "h est le noyau de filtre que l'on convolue avec x.",
  'A thirsty rat learning which lever produces juice shows dopamine bursts initially at reward delivery, then gradually shifting earlier to the cue that predicts it.':
    "Chez un rat assoiffé qui apprend quel levier donne du jus, la décharge dopaminergique apparaît d'abord au moment de la récompense, puis se décale progressivement vers l'indice qui la prédit.",
  'Small data needs regularisation, transfer learning, or simpler models.':
    "Les petits jeux de données demandent de la régularisation, du transfert d'apprentissage ou des modèles plus simples.",
  'Big data needs less help; small data needs CV.':
    "Les grands jeux de données demandent moins d'aide; les petits demandent une validation croisée.",
  'First-spike latency, phase, or precise ISIs': "Latence du premier potentiel d'action, phase ou ISI précis",
  'Rate coding represents information by mean firing rate over a window. Temporal coding uses precise spike times: latency to first spike, phase relative to an oscillation, or fine inter-spike intervals. Real brains use both, sometimes in the same population.':
    "Le codage par fréquence représente l'information par la fréquence moyenne de décharge dans une fenêtre temporelle. Le codage temporel utilise les temps précis des potentiels d'action: latence jusqu'au premier potentiel d'action, phase par rapport à une oscillation ou intervalles inter-spikes fins. Les vrais cerveaux utilisent les deux, parfois dans la même population.",
  'Sparse coding represents each input with only a small subset of active neurons drawn from a larger population. Learning sparse codes on natural images yields oriented, localised, bandpass receptive fields resembling V1 simple cells.':
    "Le codage parcimonieux représente chaque entrée avec un petit sous-ensemble de neurones actifs au sein d'une population plus grande. Apprendre des codes parcimonieux sur des images naturelles produit des champs récepteurs localisés, orientés et passe-bande qui ressemblent à ceux des cellules simples de V1.",
  'Sparse codes are energy-efficient and explain a wide range of sensory representations.':
    "Les codes parcimonieux sont économes en énergie et expliquent un large éventail de représentations sensorielles.",
};

function lookupFrench(value: string): string {
  return manualFrench[value] ?? frDictionary[value] ?? value;
}

const scientificFrenchReplacements: Array<[RegExp, string]> = [
  [/\bCadences de déclenchement\b/g, 'Fréquences de décharge'],
  [/\bCadence de déclenchement\b/g, 'Fréquence de décharge'],
  [/\bCadences de tir\b/g, 'Fréquences de décharge'],
  [/\bCadence de tir\b/g, 'Fréquence de décharge'],
  [/\bcadences de déclenchement\b/g, 'fréquences de décharge'],
  [/\bcadence de déclenchement\b/g, 'fréquence de décharge'],
  [/\bcadences de tir\b/g, 'fréquences de décharge'],
  [/\bcadence de tir\b/g, 'fréquence de décharge'],
  [/\bTaux de déclenchement\b/g, 'Fréquence de décharge'],
  [/\btaux de déclenchement\b/g, 'fréquence de décharge'],
  [/\btaux de tir\b/g, 'fréquence de décharge'],
  [/\btaux de population\b/g, 'fréquences de population'],
  [/\bmodèles de taux\b/g, 'modèles de fréquence de décharge'],
  [/\bModèles de taux\b/g, 'Modèles de fréquence de décharge'],
  [/\btaux lisses\b/g, 'fréquences moyennes'],
  [/\btaux de potentiel d'action\b/g, "intensité d'émission des potentiels d'action"],
  [/\bTir phasique\b/g, 'Décharge phasique'],
  [/\bmode de tir\b/g, 'mode de décharge'],
  [/\btir phasique\b/g, 'décharge phasique'],
  [/\btir irrégulier\b/g, 'décharge irrégulière'],
  [/\bson tir\b/g, 'sa fréquence de décharge'],
  [/\bcuisson\b/g, 'décharge'],
  [/\bDéclenchement de potentiels d'action à des taux élevés\b/g, "Émission de potentiels d'action à haute fréquence"],
  [/\bse déclenchant\b/g, 'déchargeant'],
  [/\bschémas de déclenchement\b/g, 'patrons de décharge'],
  [/\bpatrons de tir\b/g, 'patrons de décharge'],
  [/\bmodéliser le déclenchement neuronal\b/g, 'modéliser la décharge neuronale'],
  [/\ble déclenchement neuronal\b/g, 'la décharge neuronale'],
  [/\bLe déclenchement des neurones dopaminergiques\b/g, 'La décharge des neurones dopaminergiques'],
  [/\bdéclenchement des cellules\b/g, 'décharge des cellules'],
  [/\bdéclenchement présynaptique soutenu\b/g, 'décharge présynaptique soutenue'],
  [/\bdéclencher un tir incontrôlé\b/g, 'provoquer une activité incontrôlée'],
  [/\bdu déclenchement neuronal\b/g, 'de la décharge neuronale'],
  [/\bdéclenchement direct d’un seul neurone\b/g, "décharge directe d'un seul neurone"],
  [/\bdéclenchement direct d'un seul neurone\b/g, "décharge directe d'un seul neurone"],
  [/\bdéclenchement d’un neurone\b/g, "décharge d'un neurone"],
  [/\bdéclenchement d'un neurone\b/g, "décharge d'un neurone"],
  [/\bvers le déclenchement\b/g, 'vers le seuil'],
  [/\bdu déclenchement\b/g, 'de la décharge'],
  [/\bloin du déclenchement\b/g, 'loin du seuil'],
  [/\bvariables de déclenchement\b/g, 'variables de porte'],
  [/\bVariables de déclenchement\b/g, 'Variables de porte'],
  [/\bvariable de déclenchement\b/g, 'variable de porte'],
  [/\bcinétique de déclenchement\b/g, "cinétique d'ouverture des canaux"],
  [/\btypes de déclenchement neuronal\b/g, "classes d'excitabilité neuronale"],
  [/\bintrants\b/g, 'entrées'],
  [/\bintrant\b/g, 'entrée'],
  [/\bIntrants\b/g, 'Entrées'],
  [/\bIntrant\b/g, 'Entrée'],
  [/\baux bornes de sa membrane\b/g, 'à travers sa membrane'],
  [/\bmodèles informatiques\b/g, 'modèles computationnels'],
  [/\bModèles informatiques\b/g, 'Modèles computationnels'],
  [/\bfonn?ctionnalités\b/g, 'caractéristiques'],
  [/\bfonctionnalité\b/g, 'caractéristique'],
  [/\bFonctionnalités\b/g, 'Caractéristiques'],
  [/\bFonctionnalité\b/g, 'Caractéristique'],
  [/\bpointes\b/g, "potentiels d'action"],
  [/\bPointes\b/g, "Potentiels d'action"],
  [/\bpointe\b/g, "potentiel d'action"],
  [/\bPointe\b/g, "Potentiel d'action"],
  [/\bpics\b/g, "potentiels d'action"],
  [/\bPics\b/g, "Potentiels d'action"],
  [/\bpic\b/g, "potentiel d'action"],
  [/\bPic\b/g, "Potentiel d'action"],
  [/\btrain à potentiels d'action\b/g, "train de potentiels d'action"],
  [/\btrain de potentiels d’action\b/g, "train de potentiels d'action"],
  [/\btrains de potentiels d’action\b/g, "trains de potentiels d'action"],
  [/\bprobabilité de potentiel d’action\b/g, "probabilité d'émission d'un potentiel d'action"],
  [/\bprobabilité de potentiel d'action\b/g, "probabilité d'émission d'un potentiel d'action"],
  [/\bPotentiels d'action du feu\b/g, "Déclencher des potentiels d'action"],
  [/\bpotentiels d'action du feu\b/g, "déclencher des potentiels d'action"],
  [/\bSpike binaire\b/g, 'Événement binaire'],
  [/\bspike binaire\b/g, 'événement binaire'],
  [/\bla potentiel d'action\b/g, "le potentiel d'action"],
  [/\bLa potentiel d'action\b/g, "Le potentiel d'action"],
  [/\bune potentiel d'action\b/g, "un potentiel d'action"],
  [/\bUne potentiel d'action\b/g, "Un potentiel d'action"],
  [/\bdes potentiels d'action répétées\b/g, "des potentiels d'action répétés"],
  [/\bDes potentiels d'action répétées\b/g, "Des potentiels d'action répétés"],
  [/\bPotentiels d'action indépendantes\b/g, "Potentiels d'action indépendants"],
  [/\bpotentiels d'action indépendantes\b/g, "potentiels d'action indépendants"],
  [/\bpotentiels d'action mesurées\b/g, "potentiels d'action mesurés"],
  [/\bPotentiels d'action mesurées\b/g, "Potentiels d'action mesurés"],
  [/\bpotentiels d'action limitées\b/g, "potentiels d'action limités"],
  [/\bPotentiels d'action limitées\b/g, "Potentiels d'action limités"],
  [/\bpotentiels d'action neuronales\b/g, "potentiels d'action neuronaux"],
  [/\bPotentiels d'action neuronales\b/g, "Potentiels d'action neuronaux"],
  [/\bpotentiels d'action synaptiques\b/g, 'événements synaptiques'],
  [/\bPotentiels d'action synaptiques\b/g, 'Événements synaptiques'],
  [/\bFutures potentiels d'action\b/g, "Potentiels d'action futurs"],
  [/\bfutures potentiels d'action\b/g, "potentiels d'action futurs"],
  [/\bLa hauteur de le potentiel d'action\b/g, "L'amplitude du potentiel d'action"],
  [/\bla hauteur de le potentiel d'action\b/g, "l'amplitude du potentiel d'action"],
  [/\bincapable de potentiel d'action\b/g, "incapable d'émettre des potentiels d'action"],
  [/\bPotentiels d'action de globules rouges\b/g, 'Prolongements de globules rouges'],
  [/\bpotentiels d'action de globules rouges\b/g, 'prolongements de globules rouges'],
  [/\bUn potentiel d'action aléatoire\b/g, "Un potentiel d'action isolé aléatoire"],
  [/\bun potentiel d'action aléatoire\b/g, "un potentiel d'action isolé aléatoire"],
  [/\bun seul potentiel d'action\b/g, "un potentiel d'action isolé"],
  [/\bUn seul potentiel d'action\b/g, "Un potentiel d'action isolé"],
  [/\bLe potentiel d'action du tout ou rien\b/g, 'Le signal tout ou rien'],
  [/\ble potentiel d'action du tout ou rien\b/g, 'le signal tout ou rien'],
  [/\bPoussez le potentiel d'action, retirez-la\b/g, 'Rapprocher du seuil, puis freiner'],
  [/\bpoussez le potentiel d'action, retirez-la\b/g, 'rapprocher du seuil, puis freiner'],
  [/\bUn avion 2D\b/g, 'Un plan 2D'],
  [/\bun avion 2D\b/g, 'un plan 2D'],
  [/\bUn avion\b/g, 'Un plan'],
  [/\bun avion\b/g, 'un plan'],
  [/émetteurs/g, 'neurotransmetteurs'],
  [/émetteur/g, 'neurotransmetteur'],
  [/Émetteurs/g, 'Neurotransmetteurs'],
  [/Émetteur/g, 'Neurotransmetteur'],
  [/(^|[^A-Za-zÀ-ÖØ-öø-ÿ])transmetteurs/g, '$1neurotransmetteurs'],
  [/(^|[^A-Za-zÀ-ÖØ-öø-ÿ])transmetteur/g, '$1neurotransmetteur'],
  [/(^|[^A-Za-zÀ-ÖØ-öø-ÿ])Transmetteurs/g, '$1Neurotransmetteurs'],
  [/(^|[^A-Za-zÀ-ÖØ-öø-ÿ])Transmetteur/g, '$1Neurotransmetteur'],
  [/\bles terminaux axonaux\b/g, 'les terminaisons axonales'],
  [/\bLes terminaux axonaux\b/g, 'Les terminaisons axonales'],
  [/\bau niveau du terminal\b/g, 'au niveau de la terminaison'],
  [/\bau niveau des terminaux\b/g, 'au niveau des terminaisons'],
  [/\borthographes\b/g, 'claviers virtuels'],
  [/\bmappant\b/g, 'qui associent'],
  [/\bMappage\b/g, 'Association'],
  [/\bmappage\b/g, 'association'],
  [/\bmodèle formé\b/g, 'modèle entraîné'],
  [/\bmodèles formés\b/g, 'modèles entraînés'],
  [/\bVAE formé\b/g, 'VAE entraîné'],
  [/\bauto-encodeur masqué formé\b/g, 'auto-encodeur masqué entraîné'],
  [/\bmodèle clinique formé\b/g, 'modèle clinique entraîné'],
  [/\bformé sur\b/g, 'entraîné sur'],
  [/\bformée sur\b/g, 'entraînée sur'],
  [/\bformés sur\b/g, 'entraînés sur'],
  [/\bformées sur\b/g, 'entraînées sur'],
  [/\bintégrations\b/g, 'représentations'],
  [/\bIntégrations\b/g, 'Représentations'],
  [/\btrieurs de potentiels d'action\b/g, "algorithmes de tri des potentiels d'action"],
  [/\bTrieurs de potentiels d'action\b/g, "Algorithmes de tri des potentiels d'action"],
  [/\btrieur de potentiels d'action\b/g, "algorithme de tri des potentiels d'action"],
  [/\bTrieur de potentiels d'action\b/g, "Algorithme de tri des potentiels d'action"],
  [/\bcourants et potentiels d'action synaptiques\b/g, "courants synaptiques et potentiels d'action"],
  [/\bcourants et les événements synaptiques\b/g, "courants synaptiques et potentiels d'action"],
  [/\bcourants et événements synaptiques\b/g, "courants synaptiques et potentiels d'action"],
  [/\bspike de dopamine\b/g, 'bouffée phasique de dopamine'],
  [/\bpic de dopamine\b/g, 'bouffée phasique de dopamine'],
  [/\bpotentiel d'action de dopamine\b/g, 'bouffée phasique de dopamine'],
  [/\bPotentiel d'action de dopamine\b/g, 'Bouffée phasique de dopamine'],
  [/\bUn potentiel d'action dans le spectre révèle\b/g, 'Un maximum spectral révèle'],
  [/\bun potentiel d'action dans le spectre révèle\b/g, 'un maximum spectral révèle'],
  [/\bLe potentiel d'action indique la valeur du stimulus qui stimule le plus le neurone\b/g, 'Le maximum indique la valeur du stimulus qui active le plus le neurone'],
  [/\bdes potentiels d'action d’activité stables\b/g, "des bosses d'activité stables"],
  [/\bDes potentiels d'action d’activité stables\b/g, "Des bosses d'activité stables"],
  [/\bPotentiels d'action audio\b/g, 'Événements audio'],
  [/\bpotentiels d'action audio\b/g, 'événements audio'],
  [/\bPotentiels d'action de comportement ou de stimuli\b/g, 'Événements comportementaux ou stimulus'],
  [/\bpotentiels d'action de comportement ou de stimuli\b/g, 'événements comportementaux ou stimulus'],
  [/\bFilms à fluorescence lente qui proxy un potentiel d'action\b/g, "Films de fluorescence lents utilisés comme proxy de l'activité neuronale"],
  [/\bun neurone se déclenche\b/g, "un neurone émet un potentiel d'action"],
  [/\bla facilité avec laquelle un neurone se déclenche\b/g, "la facilité avec laquelle un neurone émet un potentiel d'action"],
  [/\bLe gradient ∇f potentiel d'action dans la direction de\b/g, 'Le gradient ∇f indique la direction de'],
  [/\ble gradient ∇f potentiel d'action dans la direction de\b/g, 'le gradient ∇f indique la direction de'],
  [/\ba été enrichi \(1\) ou non \(0\)\b/g, "a émis un potentiel d'action (1), ou non (0)"],
  [/\bDans un bac de 1 ms\b/g, 'Dans un intervalle de 1 ms'],
  [/\bdans un bac de 1 ms\b/g, 'dans un intervalle de 1 ms'],
  [/\bflux de réaction\b/g, "flux d'information vers le cortex"],
  [/\bFlux de réaction\b/g, "Flux d'information vers le cortex"],
  [/\bPatrouillez les microglies pour détecter les dommages et élaguez les connexions inutilisées\b/g, 'La microglie surveille les lésions et élague les connexions inutilisées'],
  [/\bproductions d’amygdale\b/g, "sorties de l'amygdale"],
  [/\bProductions d’amygdale\b/g, "Sorties de l'amygdale"],
  [/\bGanglions de la base et sélection d'action\b/g, "Noyaux gris centraux et sélection de l'action"],
  [/\bsélection d'action\b/g, "sélection de l'action"],
  [/\bDémarrage d'action plus facile\b/g, "Initiation de l'action plus facile"],
  [/\bdémarrage d'action plus facile\b/g, "initiation de l'action plus facile"],
  [/\bseuil de potentiel d'action\b/g, "seuil d'émission du potentiel d'action"],
  [/\btension après une réinitialisation de potentiel d'action\b/g, "potentiel après réinitialisation"],
  [/\bmodèles de potentiel d'action\b/g, "modèles à potentiels d'action"],
  [/\bModèles de potentiel d'action\b/g, "Modèles à potentiels d'action"],
  [/\bqu’un décharge directe\b/g, "qu'une décharge directe"],
  [/\bqu'un décharge directe\b/g, "qu'une décharge directe"],
  [/\bse déclenchent\b/g, 'déchargent'],
  [/\bse déclenche\b/g, 'décharge'],
  [/\binter-spikes\b/g, "inter-spikes"],
  [/\bSignal GRAS\b/g, 'signal BOLD'],
  [/\bsignal GRAS\b/g, 'signal BOLD'],
  [/\bLe tri de potentiels d'action\b/g, "Le tri des potentiels d'action"],
  [/\ble tri de potentiels d'action\b/g, "le tri des potentiels d'action"],
  [/\bde nombreux petits apports indépendants tendent vers un théorème central limite gaussien\b/g, 'de nombreuses petites contributions indépendantes tendent vers une loi gaussienne'],
  [/\bprobabilité raisonnable que vous puissiez vous adapter à des données neuronales réelles\b/g, "vraisemblance traitable que l'on peut ajuster à des données neuronales réelles"],
  [/\bmise en scène du sommeil\b/g, 'classification des stades du sommeil'],
  [/\bTrieurs de potentiels d'action de train\b/g, "Entraîner des algorithmes de tri des potentiels d'action"],
  [/\btrieurs modernes\b/g, 'algorithmes modernes de tri'],
  [/\bLe dérivé des potentiels d'action\b/g, "La dérivée des potentiels d'action"],
];

function polishScientificFrench(value: string): string {
  return scientificFrenchReplacements.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), value);
}

function translateFrenchCore(value: string): string {
  if (looksLikeStandaloneFormula(value) && !hasNaturalLanguageCue(value)) return value;
  return lookupFrench(value);
}

function preserveOuterWhitespace(source: string, translated: string): string {
  const leading = source.match(/^\s*/)?.[0] ?? '';
  const trailing = source.match(/\s*$/)?.[0] ?? '';
  return `${leading}${translated}${trailing}`;
}

function looksLikeStandaloneFormula(text: string): boolean {
  const wordCount = text.match(/[A-Za-zÀ-ÖØ-öø-ÿ]{2,}/g)?.length ?? 0;
  const hasMathSyntax = /[=∫∑∂∇√≈≤≥<>^_+*\/]|[₀-₉ᵀᵢ-ᵤ]|[Α-ω]/.test(text);
  return hasMathSyntax && wordCount < 3;
}

function hasNaturalLanguageCue(text: string): boolean {
  return /\b(with|means|learns|always|at|large|small|lower|higher|faster|slower|independent|dependent|dimensional|vector|voltage|signal|noise|rate|state|input|output)\b/i.test(text);
}

function translateDynamicFrench(text: string): string | null {
  let match = text.match(/^(\d+)\/(\d+) completed$/);
  if (match) return `${match[1]}/${match[2]} terminé`;

  match = text.match(/^(\d+) completed$/);
  if (match) return `${match[1]} terminé`;

  match = text.match(/^(\d+) coins?$/);
  if (match) return `${match[1]} pièce${match[1] === '1' ? '' : 's'}`;

  match = text.match(/^(\d+) lessons?$/);
  if (match) return `${match[1]} leçon${match[1] === '1' ? '' : 's'}`;

  match = text.match(/^Earn (\d+) coins?$/);
  if (match) return `Gagner ${match[1]} pièce${match[1] === '1' ? '' : 's'}`;

  match = text.match(/^Need (\d+) more coins?$/);
  if (match) return `Il manque ${match[1]} pièce${match[1] === '1' ? '' : 's'}`;

  match = text.match(/^Unlock for (\d+) coins?$/);
  if (match) return `Débloquer pour ${match[1]} pièce${match[1] === '1' ? '' : 's'}`;

  match = text.match(/^Continue: (.+)$/);
  if (match) return `Continuer : ${translateFrenchCore(match[1])}`;

  match = text.match(/^Unlock: (.+)$/);
  if (match) return `Débloquer : ${translateFrenchCore(match[1])}`;

  match = text.match(/^(\d+) lesson(s?) to go\.$/);
  if (match) return `${match[1]} leçon${match[1] === '1' ? '' : 's'} restante${match[1] === '1' ? '' : 's'}.`;

  match = text.match(/^(\d+)\/(\d+) correct$/);
  if (match) return `${match[1]}/${match[2]} correct`;

  match = text.match(/^(\d+)\/(\d+) answered$/);
  if (match) return `${match[1]}/${match[2]} répondu`;

  match = text.match(/^streak (\d+)$/);
  if (match) return `série ${match[1]}`;

  match = text.match(/^(\d+) topics?$/);
  if (match) return `${match[1]} sujet${match[1] === '1' ? '' : 's'}`;

  match = text.match(/^(\d+) XP total$/);
  if (match) return `${match[1]} XP au total`;

  match = text.match(/^Level (\d+)$/);
  if (match) return `Niveau ${match[1]}`;

  match = text.match(/^level (\d+)$/i);
  if (match) return `niveau ${match[1]}`;

  match = text.match(/^(\d+) XP to level (\d+)$/);
  if (match) return `${match[1]} XP avant le niveau ${match[2]}`;

  match = text.match(/^Milestone - (\d+) lessons$/);
  if (match) return `Jalon - ${match[1]} leçons`;

  match = text.match(/^Current streak: (\d+) day(s?)\. Keep the rhythm gentle and steady\.$/);
  if (match) return `Série actuelle : ${match[1]} jour${match[1] === '1' ? '' : 's'}. Continue régulièrement, à ton rythme.`;

  match = text.match(/^(\d+) lessons completed · (\d+) total XP$/);
  if (match) return `${match[1]} leçons terminées · ${match[2]} XP au total`;

  match = text.match(/^(\d+)\/(\d+) · avg (\d+)%$/);
  if (match) return `${match[1]}/${match[2]} · moy. ${match[3]}%`;

  match = text.match(/^(\d+) need support · avg best (\d+)% · success (\d+)%$/);
  if (match) return `${match[1]} ont besoin de soutien · meilleur moy. ${match[2]}% · réussite ${match[3]}%`;

  match = text.match(/^success (\d+)%, avg best (\d+)%$/);
  if (match) return `réussite ${match[1]} %, meilleur moy. ${match[2]} %`;

  match = text.match(/^(\d+) need support, avg best (\d+)%$/);
  if (match) return `${match[1]} ont besoin de soutien, meilleur moy. ${match[2]} %`;

  match = text.match(/^best (\d+)%, attempts (\d+)$/);
  if (match) return `meilleur ${match[1]} %, tentatives ${match[2]}`;

  match = text.match(/^(.+) - best (\d+)%$/);
  if (match) return `${match[1]} - meilleur ${match[2]} %`;

  match = text.match(/^(.+) · (not_started|beginner|practicing|strong|mastered) · best (\d+)% · attempts (\d+)$/);
  if (match) return `${translateFrenchCore(match[1])} · ${translateFrenchCore(match[2])} · meilleur ${match[3]} % · tentatives ${match[4]}`;

  match = text.match(/^Earn (\d+) more coins? to unlock this lesson\.$/);
  if (match) return `Gagne ${match[1]} pièce${match[1] === '1' ? '' : 's'} de plus pour débloquer cette leçon.`;

  match = text.match(/^Unlock this lesson for (\d+) coins?\.$/);
  if (match) return `Débloque cette leçon pour ${match[1]} pièce${match[1] === '1' ? '' : 's'}.`;

  match = text.match(/^Unlocked for (\d+) coins?\. Nice choice\.$/);
  if (match) return `Débloqué pour ${match[1]} pièce${match[1] === '1' ? '' : 's'}. Bon choix.`;

  return null;
}

export function translateText(value: string, language: AppLanguage): string {
  if (language === 'en') return value;
  if (!value.trim()) return value;

  const core = value.trim();

  const dynamic = translateDynamicFrench(core);
  if (dynamic) return preserveOuterWhitespace(value, polishScientificFrench(dynamic));

  const translated = lookupFrench(core);
  if (translated !== core) {
    if (looksLikeStandaloneFormula(core) && !hasNaturalLanguageCue(core)) return value;
    return preserveOuterWhitespace(value, polishScientificFrench(translated));
  }

  if (looksLikeStandaloneFormula(core)) return value;

  const polishedCore = polishScientificFrench(core);
  if (polishedCore !== core) {
    return preserveOuterWhitespace(value, polishedCore);
  }

  return value;
}
