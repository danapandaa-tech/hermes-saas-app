/**
 * mindToKnowledge.ts
 * 
 * Analyzes cognitive patterns and generates insights that can be saved to the Knowledge Base.
 * This creates a bridge between the Mind (cognitive state) and Knowledge (memories).
 */

import { useCognitiveStore } from './useCognitiveStore'
import type { Memory } from '../memory-store'

export type MindInsight = {
  type: 'insight' | 'preference' | 'pattern'
  title: string
  content: string
  confidence: 'high' | 'medium' | 'low'
  category: 'emotional' | 'sensory' | 'state' | 'spark'
}

/**
 * Analyze cognitive state and generate insights
 */
export function generateMindInsights(userId: string): MindInsight[] {
  const state = useCognitiveStore.getState()
  const insights: MindInsight[] = []

  // Analyze emotional patterns
  if (state.emotionalLog.length >= 3) {
    const recentEmotions = state.emotionalLog.slice(-10)
    const emotionCounts: Record<string, number> = {}
    recentEmotions.forEach((e) => {
      emotionCounts[e.state] = (emotionCounts[e.state] || 0) + 1
    })
    
    const dominantEmotion = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0]
    if (dominantEmotion && dominantEmotion[1] >= 3) {
      insights.push({
        type: 'insight',
        title: `Dominant Emotion: ${dominantEmotion[0]}`,
        content: `You've been feeling "${dominantEmotion[0]}" frequently (${dominantEmotion[1]} times in recent logs). This might indicate a pattern worth exploring.`,
        confidence: 'high',
        category: 'emotional',
      })
    }
  }

  // Analyze sensory patterns
  if (state.sensoryLog.length >= 3) {
    const recentSensory = state.sensoryLog.slice(-10)
    const overloadCount = recentSensory.filter((s) => 
      s.overall >= 4 || s.visual >= 4 || s.auditory >= 4 || s.tactile >= 4
    ).length
    
    if (overloadCount >= 2) {
      insights.push({
        type: 'preference',
        title: 'Sensory Overload Pattern',
        content: `You've experienced sensory overload ${overloadCount} times recently. Consider identifying triggers and creating accommodation strategies.`,
        confidence: 'medium',
        category: 'sensory',
      })
    }
  }

  // Analyze cognitive state transitions
  if (state.cognitiveState.history.length >= 5) {
    const recentStates = state.cognitiveState.history.slice(-10)
    const stateCounts: Record<string, number> = {}
    recentStates.forEach((h) => {
      stateCounts[h.to] = (stateCounts[h.to] || 0) + 1
    })
    
    const frequentState = Object.entries(stateCounts).sort((a, b) => b[1] - a[1])[0]
    if (frequentState && frequentState[1] >= 3) {
      insights.push({
        type: 'insight',
        title: `Frequent State: ${frequentState[0]}`,
        content: `You've been in the "${frequentState[0]}" state ${frequentState[1]} times recently. This is your most common state.`,
        confidence: 'high',
        category: 'state',
      })
    }
  }

  // Analyze SPARK profile
  if (state.sparkAssessmentResults) {
    const spark = state.sparkAssessmentResults
    const profileType = spark.profileType || 'unknown'
    
    insights.push({
      type: 'insight',
      title: `SPARK Profile: ${profileType}`,
      content: `Your cognitive profile is "${profileType}" with a SPARK index of ${spark.sparkIndex?.toFixed(1) || 'N/A'}.`,
      confidence: 'high',
      category: 'spark',
    })
  }

  return insights
}

/**
 * Convert a MindInsight to a Memory format for saving
 */
export function insightToMemory(insight: MindInsight, userId: string): Omit<Memory, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    userId,
    type: insight.type === 'pattern' ? 'insight' : insight.type,
    source: 'mind',
    title: insight.title,
    content: insight.content,
    relatedIds: [],
  }
}
