/**
 * stateMachine.ts
 * Core state management for cognitive states
 * Tracks: current state, transitions, energy level, sensory load
 */

export const STATES = {
  FLOW: 'flow',
  FOCUSED: 'focused',
  SCATTERED: 'scattered',
  OVERWHELMED: 'overwhelmed',
  RECOVERING: 'recovering',
  DORMANT: 'dormant',
  HYPERFOCUS: 'hyperfocus',
  DISSOCIATED: 'dissociated',
} as const;

export type StateType = (typeof STATES)[keyof typeof STATES];

export const ENERGY_LEVELS = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
  DEPLETED: 'depleted',
} as const;

export type EnergyLevel = (typeof ENERGY_LEVELS)[keyof typeof ENERGY_LEVELS];

export const SENSORY_LEVELS = {
  CALM: 'calm',
  MODERATE: 'moderate',
  ELEVATED: 'elevated',
  OVERLOAD: 'overload',
} as const;

export type SensoryLevel = (typeof SENSORY_LEVELS)[keyof typeof SENSORY_LEVELS];

export interface TransitionEntry {
  from: StateType;
  to: StateType;
  timestamp: string;
  energy: EnergyLevel;
  sensory: SensoryLevel;
  [key: string]: unknown;
}

export interface CognitiveState {
  current: StateType;
  energy: EnergyLevel;
  sensory: SensoryLevel;
  lastTransition: string | null;
  history: TransitionEntry[];
}

export function createInitialState(): CognitiveState {
  return {
    current: STATES.DORMANT,
    energy: ENERGY_LEVELS.MEDIUM,
    sensory: SENSORY_LEVELS.CALM,
    lastTransition: null,
    history: [],
  };
}

export function transition(
  state: CognitiveState,
  newState: StateType,
  context: Record<string, unknown> = {}
): CognitiveState {
  const timestamp = new Date().toISOString();
  const entry: TransitionEntry = {
    from: state.current,
    to: newState,
    timestamp,
    energy: state.energy,
    sensory: state.sensory,
    ...context,
  };

  return {
    ...state,
    current: newState,
    lastTransition: timestamp,
    history: [...state.history.slice(-99), entry],
  };
}

export function setEnergy(state: CognitiveState, level: EnergyLevel): CognitiveState {
  return { ...state, energy: level };
}

export function setSensory(state: CognitiveState, level: SensoryLevel): CognitiveState {
  return { ...state, sensory: level };
}

export const VALID_TRANSITIONS: Record<StateType, StateType[]> = {
  [STATES.FLOW]: [STATES.FOCUSED, STATES.SCATTERED, STATES.RECOVERING, STATES.HYPERFOCUS],
  [STATES.FOCUSED]: [STATES.FLOW, STATES.SCATTERED, STATES.OVERWHELMED, STATES.HYPERFOCUS],
  [STATES.SCATTERED]: [STATES.FOCUSED, STATES.OVERWHELMED, STATES.RECOVERING, STATES.DISSOCIATED],
  [STATES.OVERWHELMED]: [STATES.RECOVERING, STATES.SCATTERED, STATES.DISSOCIATED],
  [STATES.RECOVERING]: [STATES.FOCUSED, STATES.DORMANT, STATES.SCATTERED],
  [STATES.DORMANT]: [STATES.FOCUSED, STATES.RECOVERING],
  [STATES.HYPERFOCUS]: [STATES.FLOW, STATES.FOCUSED, STATES.OVERWHELMED, STATES.RECOVERING],
  [STATES.DISSOCIATED]: [STATES.RECOVERING, STATES.DORMANT, STATES.SCATTERED],
};

export function canTransition(from: StateType, to: StateType): boolean {
  const valid = VALID_TRANSITIONS[from];
  if (!valid) return false;
  return valid.includes(to);
}
