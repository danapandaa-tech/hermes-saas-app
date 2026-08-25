/**
 * cognitiveMap.ts
 * Builds and maintains the user's cognitive profile
 */

import { STATES, ENERGY_LEVELS, type CognitiveState, type StateType, type EnergyLevel } from './stateMachine';

export const cognitiveStyles = {
  LINEAR: 'linear',
  NONLINEAR: 'nonlinear',
  CYCLICAL: 'cyclical',
  SPIRAL: 'spiral',
  CONSTELLATION: 'constellation',
} as const;

export type CognitiveStyle = (typeof cognitiveStyles)[keyof typeof cognitiveStyles];

export const attentionPatterns = {
  NARROW_FOCUS: 'narrow_focus',
  WIDE_SCAN: 'wide_scan',
  ROTATING: 'rotating',
  DEPTH_FIRST: 'depth_first',
  BURST: 'burst',
} as const;

export type AttentionPattern = (typeof attentionPatterns)[keyof typeof attentionPatterns];

export interface SensoryProfile {
  visual: string;
  auditory: string;
  tactile: string;
  olfactory: string;
}

export interface Profile {
  cognitiveStyle: CognitiveStyle;
  attentionPattern: AttentionPattern;
  sensoryProfile: SensoryProfile;
  strengths: string[];
  challenges: string[];
  triggers: string[];
  flowConditions: string[];
  recoveryStrategies: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CognitiveMapData {
  stateFrequency: Record<string, number>;
  timePatterns: Record<string, Record<string, number>>;
  topTransitions: Array<{ chain: string; count: number }>;
  insights: string[];
  totalEntries: number;
  isEmpty: boolean;
  generatedAt?: string;
}

export function createProfile(data: Partial<Profile> = {}): Profile {
  return {
    cognitiveStyle: data.cognitiveStyle || cognitiveStyles.NONLINEAR,
    attentionPattern: data.attentionPattern || attentionPatterns.ROTATING,
    sensoryProfile: data.sensoryProfile || { visual: 'high', auditory: 'medium', tactile: 'low', olfactory: 'low' },
    strengths: data.strengths || [],
    challenges: data.challenges || [],
    triggers: data.triggers || [],
    flowConditions: data.flowConditions || [],
    recoveryStrategies: data.recoveryStrategies || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function getWorkflowRecommendation(profile: Profile, currentState: CognitiveState): string[] {
  const { cognitiveStyle } = profile;
  const { current, energy } = currentState;
  const recommendations: string[] = [];

  if (cognitiveStyle === cognitiveStyles.NONLINEAR) {
    recommendations.push('Use mind-mapping, not lists');
    recommendations.push('Allow topic switching with capture');
  } else if (cognitiveStyle === cognitiveStyles.CYCLICAL) {
    recommendations.push('Work in returning spirals, not linear progress');
    recommendations.push('Build in review cycles');
  }

  if (current === STATES.OVERWHELMED || current === STATES.SCATTERED) {
    recommendations.push('Single micro-step only');
    recommendations.push('Reduce sensory input');
    recommendations.push('Grounding exercise first');
  } else if (current === STATES.FLOW || current === STATES.HYPERFOCUS) {
    recommendations.push('Protect this state');
    recommendations.push('Set a gentle timer for breaks');
  }

  if (energy === ENERGY_LEVELS.DEPLETED) {
    recommendations.push('Rest is the task');
    recommendations.push('No new inputs');
  }

  return recommendations;
}

export function buildCognitiveMap(history: CognitiveState['history'] = []): CognitiveMapData {
  if (!history.length) return { stateFrequency: {}, timePatterns: {}, topTransitions: [], insights: [], totalEntries: 0, isEmpty: true };

  const stateFrequency: Record<string, number> = {};
  const timePatterns: Record<string, Record<string, number>> = {};
  const transitionChains: Record<string, number> = {};

  history.forEach((entry, i) => {
    stateFrequency[entry.to] = (stateFrequency[entry.to] || 0) + 1;
    const hour = new Date(entry.timestamp).getHours();
    const timeBlock = hour < 6 ? 'night' : hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
    if (!timePatterns[timeBlock]) timePatterns[timeBlock] = {};
    timePatterns[timeBlock][entry.to] = (timePatterns[timeBlock][entry.to] || 0) + 1;
    if (i > 0) {
      const key = `${entry.from}->${entry.to}`;
      transitionChains[key] = (transitionChains[key] || 0) + 1;
    }
  });

  const topTransitions = Object.entries(transitionChains).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([chain, count]) => ({ chain, count }));
  const insights: string[] = [];
  const total = history.length;
  const flowCount = stateFrequency[STATES.FLOW] || 0;
  const flowPct = Math.round((flowCount / total) * 100);
  if (flowPct > 0) insights.push(`Flow state: ${flowPct}% of tracked time`);
  const overwhelmCount = stateFrequency[STATES.OVERWHELMED] || 0;
  if (overwhelmCount > total * 0.2) insights.push('Overwhelm appears frequently — consider environmental adjustments');

  return { stateFrequency, timePatterns, topTransitions, insights, totalEntries: total, isEmpty: false, generatedAt: new Date().toISOString() };
}
