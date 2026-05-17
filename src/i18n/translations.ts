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
    'Sans une lecture confortable des indices, les sommes comme Σ wᵢ rᵢ sont difficiles à lire. Avec les indices, ce sont simplement des « sommes pondérées ».',
};

function lookupFrench(value: string): string {
  return manualFrench[value] ?? frDictionary[value] ?? value;
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
  if (match) return `Série actuelle : ${match[1]} jour${match[1] === '1' ? '' : 's'}. Garde un rythme doux et régulier.`;

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
  if (dynamic) return preserveOuterWhitespace(value, dynamic);

  const translated = lookupFrench(core);
  if (translated !== core) {
    if (looksLikeStandaloneFormula(core) && !hasNaturalLanguageCue(core)) return value;
    return preserveOuterWhitespace(value, translated);
  }

  if (looksLikeStandaloneFormula(core)) return value;

  return value;
}
