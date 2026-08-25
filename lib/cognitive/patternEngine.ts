/**
 * patternEngine.ts
 * Detects patterns, cycles, burnout precursors, flow triggers
 */

import { STATES, type TransitionEntry } from './stateMachine';

export interface Pattern {
  type: string;
  description: string;
  frequency?: number;
  suggestion?: string;
  triggers?: string[];
  missing?: string[];
}

export interface PatternResult {
  patterns: Pattern[];
  warnings: string[];
  isEmpty: boolean;
  analyzedAt?: string;
  entriesAnalyzed?: number;
}

export function detectPatterns(history: TransitionEntry[] = []): PatternResult {
  if (!history.length) return { patterns: [], warnings: [], isEmpty: true };

  const patterns: Pattern[] = [];
  const warnings: string[] = [];

  const overwhelmLoop = detectOverwhelmLoop(history);
  if (overwhelmLoop.detected) {
    patterns.push({ type: 'overwhelm_loop', description: 'Overwhelm → Scatter cycle detected', frequency: overwhelmLoop.count, suggestion: 'Try grounding before task switching. Consider environmental changes.' });
    warnings.push('Recurring overwhelm pattern');
  }

  const flowChains = detectFlowChains(history);
  if (flowChains.detected) {
    patterns.push({ type: 'flow_trigger', description: 'Flow state pattern identified', triggers: flowChains.commonPreceding, suggestion: 'Recreate these conditions intentionally.' });
  }

  const burnoutCheck = detectBurnoutPrecursors(history);
  if (burnoutCheck.risk !== 'low') {
    warnings.push(`Burnout risk: ${burnoutCheck.risk} — ${burnoutCheck.reason}`);
  }

  const scatteredCheck = detectChronicState(history, STATES.SCATTERED);
  if (scatteredCheck.detected) {
    patterns.push({ type: 'chronic_scatter', description: 'Extended scattered/diffuse attention pattern', suggestion: 'May need deeper rest or sensory reduction. Not a productivity problem — a regulation problem.' });
  }

  const missing = invertedSearch(history);
  if (missing.length > 0) {
    patterns.push({ type: 'missing_states', description: 'States not appearing that might be needed', missing, suggestion: 'These cognitive states are absent from your map. Worth exploring.' });
  }

  return { patterns, warnings, isEmpty: false, analyzedAt: new Date().toISOString(), entriesAnalyzed: history.length };
}

function detectOverwhelmLoop(history: TransitionEntry[]): { detected: boolean; count: number } {
  let count = 0;
  for (let i = 2; i < history.length; i++) {
    const chain = `${history[i-2].to}->${history[i-1].to}->${history[i].to}`;
    if (chain.includes('overwhelmed') && chain.includes('scattered')) count++;
  }
  return { detected: count > 0, count };
}

function detectFlowChains(history: TransitionEntry[]): { detected: boolean; commonPreceding: string[] } {
  const precedingStates: Record<string, number> = {};
  history.forEach((entry, i) => {
    if (entry.to === STATES.FLOW && i > 0) {
      const prev = history[i - 1].to;
      precedingStates[prev] = (precedingStates[prev] || 0) + 1;
    }
  });
  const common = Object.entries(precedingStates).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([state]) => state);
  return { detected: common.length > 0, commonPreceding: common };
}

function detectBurnoutPrecursors(history: TransitionEntry[]): { risk: string; reason: string } {
  const recent = history.slice(-20);
  const depletedCount = recent.filter(e => e.energy === 'depleted').length;
  const overwhelmCount = recent.filter(e => e.to === STATES.OVERWHELMED).length;
  const recoveryCount = recent.filter(e => e.to === STATES.RECOVERING).length;

  if (depletedCount > recent.length * 0.5) return { risk: 'high', reason: 'Frequent depleted energy' };
  if (overwhelmCount > 3 && recoveryCount === 0) return { risk: 'medium', reason: 'Overwhelm without recovery' };
  if (depletedCount > recent.length * 0.3) return { risk: 'medium', reason: 'Trending low energy' };
  return { risk: 'low', reason: '' };
}

function detectChronicState(history: TransitionEntry[], state: string): { detected: boolean; percentage: number } {
  const recent = history.slice(-15);
  const count = recent.filter(e => e.to === state).length;
  return { detected: count > recent.length * 0.6, percentage: Math.round((count / recent.length) * 100) };
}

function invertedSearch(history: TransitionEntry[]): string[] {
  const seen = new Set(history.map(e => e.to));
  const allStates = Object.values(STATES);
  const missing = allStates.filter(s => !seen.has(s));
  return missing.filter(s => ![STATES.DORMANT, STATES.DISSOCIATED].includes(s));
}
