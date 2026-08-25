/**
 * sparkTranslation.ts
 * The Cognitive Translation layer (rule-based, local).
 *
 * Takes a saved SPARK assessment result and translates dimension scores into
 * strengths-first language, working conditions, and adaptive guidance.
 */

export interface SparkResults {
  results: { CI: number; ER: number; SA: number; CD: number; ED: number };
  sparkIndex: number;
  profileType: string;
}

export interface DimensionTranslation {
  key: string;
  name: string;
  score: number;
  band: 'high' | 'present' | 'quiet';
  strength: string;
  guidance: string;
  module: string;
}

export interface SparkProfile {
  profileType: string;
  sparkIndex: number;
  dimensions: DimensionTranslation[];
  active: DimensionTranslation[];
  topStrengths: string[];
  focusModules: string[];
}

const DIMENSION_TRANSLATION: Record<string, { name: string; strength: string; guidance: string; module: string }> = {
  CI: {
    name: 'Cognitive Intensity',
    strength: 'You process deeply and spot patterns others miss — you go further into ideas than most people can follow.',
    guidance: 'Protect your hyperfocus windows. Capture tangents instead of fighting them — they are usually the work, not a distraction.',
    module: 'patterns',
  },
  ER: {
    name: 'Emotional Resonance',
    strength: 'You feel and read emotion at high resolution. This is a source of empathy, depth, and meaning.',
    guidance: 'Name states early rather than suppressing them — strong feeling needs early naming. The Emotional Navigator is built for this.',
    module: 'emotional',
  },
  SA: {
    name: 'Sensory Amplification',
    strength: 'You perceive sensory detail and beauty at a level others walk past. Your environment is information.',
    guidance: 'Treat your environment as load-bearing. Use the Sensory Check-In to manage input before it tips into overload.',
    module: 'sensory',
  },
  CD: {
    name: 'Creative Divergence',
    strength: 'You think nonlinearly and generatively, connecting across fields into original directions.',
    guidance: 'Work in constellations, not lists. Capture ideas as they branch in Discoveries rather than forcing them into linear order.',
    module: 'discoveries',
  },
  ED: {
    name: 'Existential Drive',
    strength: 'You are pulled toward meaning, authenticity, and self-understanding — depth over surface.',
    guidance: 'Anchor tasks to why they matter. Meaning before productivity is how you actually sustain effort.',
    module: 'discoveries',
  },
};

const DIMENSION_ORDER = ['CI', 'ER', 'SA', 'CD', 'ED'];

function bandFor(score: number): 'high' | 'present' | 'quiet' {
  if (score >= 3) return 'high';
  if (score >= 1.5) return 'present';
  return 'quiet';
}

export function translateSparkProfile(sparkResults: SparkResults | null): SparkProfile | null {
  if (!sparkResults || !sparkResults.results) return null;

  const { results: scores, sparkIndex, profileType } = sparkResults;

  const dimensions = DIMENSION_ORDER.map((key) => {
    const score = scores[key as keyof typeof scores] ?? 0;
    const band = bandFor(score);
    const t = DIMENSION_TRANSLATION[key];
    return {
      key,
      name: t.name,
      score,
      band,
      strength: t.strength,
      guidance: t.guidance,
      module: t.module,
    };
  });

  const active = dimensions
    .filter((d) => d.band !== 'quiet')
    .sort((a, b) => b.score - a.score);

  const topStrengths = active.slice(0, 3).map((d) => d.strength);

  const focusModules: string[] = [];
  active.forEach((d) => {
    if (!focusModules.includes(d.module)) focusModules.push(d.module);
  });

  return { profileType, sparkIndex, dimensions, active, topStrengths, focusModules };
}

export function getSparkRecommendations(sparkResults: SparkResults | null): string[] {
  const profile = translateSparkProfile(sparkResults);
  if (!profile) return [];
  return profile.active.map((d) => d.guidance);
}
