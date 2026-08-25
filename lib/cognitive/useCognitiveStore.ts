/**
 * useCognitiveStore.ts
 * Zustand store for cognitive state management (server-compatible, no localStorage).
 *
 * This is the Hermes-integrated version of the ND Cognitive OS store.
 * It removes the persist middleware since Hermes uses server-side storage.
 * Data persistence will be handled via API routes in Phase 2.
 */

import { create } from 'zustand';
import { createInitialState, transition, setEnergy, setSensory, type CognitiveState, type StateType, type EnergyLevel, type SensoryLevel } from './stateMachine';
import { createProfile, buildCognitiveMap, getWorkflowRecommendation, type Profile } from './cognitiveMap';
import { detectPatterns, type PatternResult } from './patternEngine';
import { translateSparkProfile, getSparkRecommendations, type SparkResults, type SparkProfile } from './sparkTranslation';

export interface EmotionalEntry {
  id: string;
  timestamp: string;
  state: string;
  intensity: number;
  notes?: string;
  [key: string]: unknown;
}

export interface SensoryEntry {
  id: string;
  timestamp: string;
  visual: number;
  auditory: number;
  tactile: number;
  olfactory: number;
  overall: number;
  notes?: string;
  [key: string]: unknown;
}

export interface Discovery {
  id: string;
  timestamp: string;
  title: string;
  content: string;
  tags?: string[];
  [key: string]: unknown;
}

export interface CognitiveStore {
  // Core state
  cognitiveState: CognitiveState;
  profile: Profile;

  // Module data
  emotionalLog: EmotionalEntry[];
  sensoryLog: SensoryEntry[];
  discoveries: Discovery[];
  sparkAssessmentResults: SparkResults | null;

  // UI
  activeModule: string;
  showOnboarding: boolean;

  // Actions
  setActiveModule: (mod: string) => void;
  dismissOnboarding: () => void;
  updateProfile: (data: Partial<Profile>) => void;
  saveSparkResults: (results: SparkResults) => void;
  changeState: (newState: StateType, context?: Record<string, unknown>) => void;
  updateEnergy: (level: EnergyLevel) => void;
  updateSensory: (level: SensoryLevel) => void;
  logEmotionalState: (entry: Omit<EmotionalEntry, 'id' | 'timestamp'>) => void;
  logSensoryState: (entry: Omit<SensoryEntry, 'id' | 'timestamp'>) => void;
  addDiscovery: (entry: Omit<Discovery, 'id' | 'timestamp'>) => void;

  // Computed
  getCognitiveMap: () => ReturnType<typeof buildCognitiveMap>;
  getPatterns: () => PatternResult;
  getRecommendations: () => string[];
  getSparkTranslation: () => SparkProfile | null;
}

export const useCognitiveStore = create<CognitiveStore>((set, get) => ({
  // Core state
  cognitiveState: createInitialState(),
  profile: createProfile(),

  // Module data
  emotionalLog: [],
  sensoryLog: [],
  discoveries: [],
  sparkAssessmentResults: null,

  // UI
  activeModule: 'dashboard',
  showOnboarding: true,

  // Actions
  setActiveModule: (mod) => set({ activeModule: mod }),

  dismissOnboarding: () => set({ showOnboarding: false }),

  updateProfile: (data) => set((s) => ({
    profile: { ...s.profile, ...data, updatedAt: new Date().toISOString() }
  })),

  saveSparkResults: (results) => set({
    sparkAssessmentResults: results,
    activeModule: 'sparkResults'
  }),

  changeState: (newState, context) => set((s) => ({
    cognitiveState: transition(s.cognitiveState, newState, context)
  })),

  updateEnergy: (level) => set((s) => ({
    cognitiveState: setEnergy(s.cognitiveState, level)
  })),

  updateSensory: (level) => set((s) => ({
    cognitiveState: setSensory(s.cognitiveState, level)
  })),

  logEmotionalState: (entry) => set((s) => ({
    emotionalLog: [...s.emotionalLog.slice(-199), {
      ...entry,
      timestamp: new Date().toISOString(),
      id: Date.now().toString(36),
    } as EmotionalEntry]
  })),

  logSensoryState: (entry) => set((s) => ({
    sensoryLog: [...s.sensoryLog.slice(-199), {
      ...entry,
      timestamp: new Date().toISOString(),
      id: Date.now().toString(36),
    } as SensoryEntry]
  })),

  addDiscovery: (entry) => set((s) => ({
    discoveries: [...s.discoveries, {
      ...entry,
      timestamp: new Date().toISOString(),
      id: Date.now().toString(36),
    } as Discovery]
  })),

  // Computed
  getCognitiveMap: () => {
    const { cognitiveState } = get();
    return buildCognitiveMap(cognitiveState.history);
  },

  getPatterns: () => {
    const { cognitiveState } = get();
    return detectPatterns(cognitiveState.history);
  },

  getRecommendations: () => {
    const { profile, cognitiveState, sparkAssessmentResults } = get();
    const stateBased = getWorkflowRecommendation(profile, cognitiveState);
    const sparkBased = getSparkRecommendations(sparkAssessmentResults);
    return [...new Set([...sparkBased, ...stateBased])];
  },

  getSparkTranslation: () => {
    const { sparkAssessmentResults } = get();
    return translateSparkProfile(sparkAssessmentResults);
  },
}));
