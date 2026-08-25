/**
 * useCognitiveStore.test.ts
 * Focused tests for the Zustand store's computed methods:
 *   - getRecommendations (merge / de-duplication of SPARK + state-based guidance)
 *   - getSparkTranslation (null / empty-input handling)
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { useCognitiveStore } from '../useCognitiveStore';
import type { SparkResults } from '../sparkTranslation';

// --- helpers --------------------------------------------------------------

/** Build a valid SPARK result shape matching sparkTranslation.ts expectations. */
function makeSparkResults(scores: { CI: number; ER: number; SA: number; CD: number; ED: number } = { CI: 4, ER: 3, SA: 1, CD: 2, ED: 0 }): SparkResults {
  return {
    results: { ...scores },
    sparkIndex: 2.0,
    profileType: 'intense',
  };
}

/** Reset the store to a known default state before each test. */
function resetStore(overrides: Partial<Parameters<typeof useCognitiveStore.setState>[0]> = {}) {
  useCognitiveStore.setState({
    cognitiveState: {
      current: 'dormant',
      energy: 'medium',
      sensory: 'calm',
      lastTransition: null,
      history: [],
    },
    profile: {
      cognitiveStyle: 'nonlinear',
      attentionPattern: 'rotating',
      sensoryProfile: { visual: 'high', auditory: 'medium', tactile: 'low', olfactory: 'low' },
      strengths: [],
      challenges: [],
      triggers: [],
      flowConditions: [],
      recoveryStrategies: [],
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
    emotionalLog: [],
    sensoryLog: [],
    discoveries: [],
    sparkAssessmentResults: null,
    activeModule: 'dashboard',
    showOnboarding: true,
    ...overrides,
  });
}

// --- getSparkTranslation --------------------------------------------------

describe('useCognitiveStore — getSparkTranslation', () => {
  beforeEach(() => resetStore());

  it('returns null when sparkAssessmentResults is null', () => {
    resetStore({ sparkAssessmentResults: null });
    expect(useCognitiveStore.getState().getSparkTranslation()).toBeNull();
  });

  it('returns null when sparkAssessmentResults is undefined', () => {
    resetStore({ sparkAssessmentResults: undefined as unknown as null });
    expect(useCognitiveStore.getState().getSparkTranslation()).toBeNull();
  });

  it('returns null when sparkAssessmentResults has no results property', () => {
    resetStore({ sparkAssessmentResults: {} as unknown as SparkResults });
    expect(useCognitiveStore.getState().getSparkTranslation()).toBeNull();
  });

  it('returns a profile object with dimensions, active, topStrengths, and focusModules for valid SPARK data', () => {
    resetStore({ sparkAssessmentResults: makeSparkResults() });
    const result = useCognitiveStore.getState().getSparkTranslation();

    expect(result).not.toBeNull();
    expect(result).toHaveProperty('dimensions');
    expect(result).toHaveProperty('active');
    expect(result).toHaveProperty('topStrengths');
    expect(result).toHaveProperty('focusModules');
    // All five dimensions are always returned.
    expect(result!.dimensions).toHaveLength(5);
    // CI(4)=high, ER(3)=high, CD(2)=present → active; SA(1)=quiet, ED(0)=quiet → excluded.
    expect(result!.active).toHaveLength(3);
    // Active dimensions are sorted strongest-first.
    expect(result!.active[0].key).toBe('CI');
    expect(result!.active[1].key).toBe('ER');
    expect(result!.active[2].key).toBe('CD');
  });

  it('returns an empty active array when all dimension scores are below the present threshold', () => {
    resetStore({
      sparkAssessmentResults: makeSparkResults({ CI: 0, ER: 0, SA: 0, CD: 0, ED: 0 }),
    });
    const result = useCognitiveStore.getState().getSparkTranslation();

    expect(result).not.toBeNull();
    expect(result!.active).toHaveLength(0);
    expect(result!.topStrengths).toHaveLength(0);
  });
});

// --- getRecommendations ---------------------------------------------------

describe('useCognitiveStore — getRecommendations', () => {
  beforeEach(() => resetStore());

  it('returns only state-based recommendations when sparkAssessmentResults is null', () => {
    resetStore({ sparkAssessmentResults: null });
    const result = useCognitiveStore.getState().getRecommendations();

    // Default profile is nonlinear → two style-based recommendations.
    expect(result).toContain('Use mind-mapping, not lists');
    expect(result).toContain('Allow topic switching with capture');
    // No SPARK guidance mixed in.
    expect(result).toHaveLength(2);
  });

  it('returns only state-based recommendations when sparkAssessmentResults is undefined', () => {
    resetStore({ sparkAssessmentResults: undefined as unknown as null });
    const result = useCognitiveStore.getState().getRecommendations();

    expect(result).toHaveLength(2);
    expect(result).toContain('Use mind-mapping, not lists');
  });

  it('places SPARK guidance before state-based recommendations and preserves all entries', () => {
    resetStore({ sparkAssessmentResults: makeSparkResults() });
    const result = useCognitiveStore.getState().getRecommendations();

    // SPARK active dimensions: CI(4), ER(3), CD(2) → 3 guidance strings.
    // State-based (nonlinear): 2 recommendations.
    // No natural string overlap → 5 total.
    expect(result).toHaveLength(5);

    // First three are SPARK guidance, strongest-first.
    expect(result[0]).toContain('hyperfocus');      // CI guidance
    expect(result[1]).toContain('Name states');      // ER guidance
    expect(result[2]).toContain('constellations');   // CD guidance

    // Last two are state-based recommendations.
    expect(result[3]).toBe('Use mind-mapping, not lists');
    expect(result[4]).toBe('Allow topic switching with capture');
  });

  it('de-duplicates so the output contains no repeated strings', () => {
    resetStore({ sparkAssessmentResults: makeSparkResults() });
    const result = useCognitiveStore.getState().getRecommendations();

    // The Set-based merge must remove exact duplicates.
    expect(new Set(result).size).toBe(result.length);
  });

  it('returns only state-based recommendations when all SPARK scores are quiet', () => {
    resetStore({
      sparkAssessmentResults: makeSparkResults({ CI: 0, ER: 0, SA: 0, CD: 0, ED: 0 }),
    });
    const result = useCognitiveStore.getState().getRecommendations();

    // No active SPARK dimensions → only state-based recommendations remain.
    expect(result).toHaveLength(2);
    expect(result).toContain('Use mind-mapping, not lists');
  });
});
