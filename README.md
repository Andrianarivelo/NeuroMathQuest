# NeuroMath Quest

Use the web app here:

https://andrianarivelo.github.io/NeuroMathQuest/

A beautiful, gamified web and mobile learning app that teaches neuroscience, math foundations for computational neuroscience, and modern computational neuroscience concepts. Built with Expo React Native and TypeScript.

## Student Quick Start

1. Open https://andrianarivelo.github.io/NeuroMathQuest/
2. Click **Let's begin**.
3. Choose your learning goal and daily lesson target.
4. Click **Start learning**.
5. Use **Continue** on the home screen to open the next lesson.
6. Read the short lesson, then click **Start quiz**.

Progress is saved in the browser on the same device. No account, install, or App Store download is required.

## Features

- **70 hand-written lessons** across 3 learning tracks
- **Track A — Neuroscience Basics** (20 lessons, fully unlocked from day one)
- **Track B — Math Foundations** (20 lessons, sequential unlock)
- **Track C — Computational Neuroscience** (30 lessons, prerequisite-based unlock)
- **Gamified reward loop**: XP, coins, streaks, 0–3 star mastery, levels, achievements, daily quests, milestone chests
- **Spaced review system** that resurfaces weak and forgotten concepts
- **Offline-first**: no backend, no sign-in, no network required
- **SQLite persistence** for all user progress
- **Polished UI** with Reanimated animations, haptic feedback, and a custom design system
- **5 tab navigation**: Home, Learn, Review, Progress, Profile
- **Onboarding flow** with goal selection and daily target setting

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Expo SDK 55, React Native |
| Navigation | Expo Router (file-based) |
| Language | TypeScript (strict) |
| Animations | React Native Reanimated |
| Database | expo-sqlite (SQLite) |
| Haptics | expo-haptics |
| Gradients | expo-linear-gradient |
| Images | expo-image |
| SVG | react-native-svg |
| Safe areas | react-native-safe-area-context |
| Screens | react-native-screens |
| Testing | jest-expo, @testing-library/react-native |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli` or use `npx expo`)
- For iOS: macOS with Xcode 15+
- For Android: Android Studio with an emulator or connected device

### Install

```bash
cd NeuroMathQuest
npm install
```

### Generate placeholder assets

```bash
npm run generate:assets
```

### Start development

```bash
# Start Expo dev server
npx expo start

# Start on iOS simulator
npx expo start --ios

# Start on Android emulator
npx expo start --android
```

### Web build and preview

```bash
npm run web:build
npm run web:preview
```

The local production preview opens at:

http://localhost:8082/NeuroMathQuest/

### Run tests

```bash
npm test
```

### Type check

```bash
npm run lint
```

### Run Expo Doctor

```bash
npx expo-doctor
```

## GitHub Pages Deployment

Every push to `master` deploys the web app with GitHub Actions.

- Public student URL: https://andrianarivelo.github.io/NeuroMathQuest/
- Workflow: `.github/workflows/pages.yml`
- Build output: `dist`
- GitHub Pages base path: `/NeuroMathQuest`

If the link is not live yet, open the repository on GitHub, go to **Actions**, wait for **Deploy Web App** to finish, then refresh the link.

## Building for Production

### EAS Build Setup

```bash
# Install EAS CLI
npm install -g eas-cli

# Log in to Expo
eas login

# Update eas.json projectId with your real project ID
# Update app.json ios.bundleIdentifier and android.package
```

### Development build (internal testing)

```bash
# iOS simulator
eas build --profile development --platform ios

# Android APK
eas build --profile development --platform android
```

### Preview build (internal distribution)

```bash
eas build --profile preview --platform all
```

### Production build

```bash
# iOS App Store
eas build --profile production --platform ios

# Android Play Store (AAB)
eas build --profile production --platform android
```

### Submit to stores

```bash
# App Store (requires Apple Developer account)
eas submit --platform ios

# Google Play (requires service account key in secrets/)
eas submit --platform android
```

## Project Structure

```
NeuroMathQuest/
├── app/                    # Expo Router screens
│   ├── _layout.tsx         # Root layout
│   ├── index.tsx           # Entry redirect
│   ├── quiz-summary.tsx    # Quiz results screen
│   ├── onboarding/         # Onboarding flow
│   │   ├── welcome.tsx
│   │   ├── goal.tsx
│   │   ├── daily-target.tsx
│   │   └── preview.tsx
│   ├── (tabs)/             # Main tab navigation
│   │   ├── home.tsx
│   │   ├── learn.tsx
│   │   ├── review.tsx
│   │   ├── progress.tsx
│   │   └── profile.tsx
│   ├── lesson/[id].tsx     # Lesson detail screen
│   └── quiz/[id].tsx       # Quiz screen
├── src/
│   ├── components/         # Reusable UI components
│   ├── content/            # 70 lessons + encouragement + achievements
│   ├── db/                 # SQLite schema and initialization
│   ├── hooks/              # React hooks (useProgress, useSettings, etc.)
│   ├── repositories/       # Data access layer
│   ├── services/           # Business logic (mastery, unlock, reward, quest, review)
│   ├── theme/              # Design tokens + ThemeProvider
│   └── utils/              # Date helpers, formatters
├── __tests__/              # Unit tests
├── assets/                 # App icons, splash screen
├── scripts/                # Asset generation
├── app.json                # Expo config
├── eas.json                # EAS Build config
├── babel.config.js
├── metro.config.js
├── tsconfig.json
└── package.json
```

## Content

### Track A: Neuroscience Basics (20 lessons)
Neuron anatomy, resting potential, ion channels, action potentials, chemical synapses, excitatory/inhibitory transmission, neurotransmitters, receptors, glia, sensory systems, motor systems, cortex, thalamus, basal ganglia, cerebellum, hippocampus, amygdala, attention, sleep/rhythms, modern methods.

### Track B: Math Foundations (20 lessons)
Scalars, vectors, components, dimension, subscript notation, time notation, R^n, matrices, rows/columns, matrix-vector product, weighted sums, connectivity matrices, functions, derivatives, differential equations, system state, state space, random variables, Bernoulli/spikes, Poisson/spike counts.

### Track C: Computational Neuroscience (30 lessons)
LIF neurons, membrane time constant, threshold/reset/refractoriness, firing rate models, recurrent networks, E/I balance, tuning curves, population coding, neural decoding, Bayesian inference, correlation/covariance, noise correlations, Markov processes, stochastic spike trains, Hebbian plasticity, STDP, homeostatic plasticity, attractor networks, Hopfield networks, continuous attractors, oscillations, Fourier intuition, filtering/convolution, GLMs, PCA, neural manifolds, RL/dopamine, predictive coding, efficient coding, brain-computer interfaces.

## Gamification System

- **XP**: earned per quiz; scales with score; bonuses for perfects and mastery
- **Coins**: smaller currency earned alongside XP
- **Streaks**: consecutive days of activity
- **Stars**: 0–3 per lesson tied to mastery level
- **Mastery levels**: not_started → beginner → practicing → strong → mastered
- **Levels**: grow with total XP using a power-law curve
- **Achievements**: 19 milestones from "First Step" to "Full Journey"
- **Daily quests**: 3 deterministic quests per day from a rotating bank
- **Milestone chests**: unlock every 5 completed lessons
- **Confetti**: on perfect scores and mastery milestones
- **Haptic feedback**: on correct answers, streaks, and rewards

## Encouragement System

Copy banks for 11 contexts: correct answers, incorrect answers, first lesson, lesson complete, mastery earned, streak saved, chest opened, quest complete, review win, comeback, daily goal, and milestones.

Tone: warm, respectful, smart, concise — never patronizing, sarcastic, or punitive.

## What Makes This App Feel Motivating

### Reward loop
Every interaction produces visible progress. Complete a lesson and you see XP animate, coins appear, stars fill, and the path advance. Wrong answers still earn XP (minimum 40% of base) and show a kind explanation. Perfect scores trigger confetti and sound effects. Every 5 lessons unlock a milestone chest. Mastery takes repeated success, not a lucky guess — so earning 3 stars genuinely feels earned.

### Encouraging UX
The encouragement engine uses context-specific copy that is warm and intelligent without being patronizing. Wrong answers say "Not quite — but now you have a sharper idea" rather than "Wrong!" or "Try harder!" The daily goal ring and streak chip provide gentle positive pressure without making the user feel punished for missing a day. The comeback messages welcome returning users without guilt.

### Progression model
Three tracks create a layered progression: neuroscience basics unlock immediately (zero friction to start), math unlocks linearly (clear next-step), and computational neuroscience unlocks through prerequisites (a sense of convergence). The path map makes locked, current, and mastered lessons visually distinct. Users always know what to do next because the recommended lesson is one tap away. Review resurfaces weak concepts automatically, making forgetting feel like a normal part of learning rather than a failure.

### Why it works
The combination of short lessons (4–6 min), visible XP counters, daily quests, streak mechanics, and spaced review creates a compounding sense of competence and momentum. The learner finishes each session having completed something real and seeing tangible proof of it. That feeling of "I am actually learning this" is the core motivation engine.
