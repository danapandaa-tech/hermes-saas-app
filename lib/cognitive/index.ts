/**
 * lib/cognitive/index.ts
 * Barrel export for the cognitive logic layer.
 *
 * This module is a direct port of the ND Cognitive OS logic layer,
 * converted to TypeScript for integration with the Hermes SaaS app.
 *
 * All functions are pure (no side effects, no network, no AI).
 * The store uses Zustand without persist middleware — data persistence
 * will be handled via API routes in Phase 2.
 */

export {
  STATES,
  ENERGY_LEVELS,
  SENSORY_LEVELS,
  VALID_TRANSITIONS,
  createInitialState,
  transition,
  setEnergy,
  setSensory,
  canTransition,
  type StateType,
  type EnergyLevel,
  type SensoryLevel,
  type TransitionEntry,
  type CognitiveState,
} from './stateMachine';

export {
  cognitiveStyles,
  attentionPatterns,
  createProfile,
  getWorkflowRecommendation,
  buildCognitiveMap,
  type CognitiveStyle,
  type AttentionPattern,
  type SensoryProfile,
  type Profile,
  type CognitiveMapData,
} from './cognitiveMap';

export {
  detectPatterns,
  type Pattern,
  type PatternResult,
} from './patternEngine';

export {
  translateSparkProfile,
  getSparkRecommendations,
  type SparkResults,
  type DimensionTranslation,
  type SparkProfile,
} from './sparkTranslation';

export {
  useCognitiveStore,
  type CognitiveStore,
  type EmotionalEntry,
  type SensoryEntry,
  type Discovery,
} from './useCognitiveStore';


// Data access (server-side only — requires DATABASE_URL)
export { loadCognitiveState, saveCognitiveState } from './cognitiveDb';

// Validation schemas
export {
  putCognitiveStateRequest,
  cognitiveStateResponse,
  cognitiveStateSchema,
  profileSchema,
  sparkResultsSchema,
  type PutCognitiveStateRequest,
  type CognitiveStateResponse,
} from './validation';
