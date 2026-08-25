/**
 * lib/cognitive/validation.ts
 * Zod schemas for validating cognitive API request/response shapes.
 */
import { z } from 'zod';

// State machine enums
export const stateValues = ['flow', 'focused', 'scattered', 'overwhelmed', 'recovering', 'dormant', 'hyperfocus', 'dissociated'] as const;
export const energyValues = ['high', 'medium', 'low', 'depleted'] as const;
export const sensoryValues = ['calm', 'moderate', 'elevated', 'overload'] as const;

export const transitionEntrySchema = z.object({
  from: z.enum(stateValues),
  to: z.enum(stateValues),
  timestamp: z.string(),
  energy: z.enum(energyValues),
  sensory: z.enum(sensoryValues),
}).passthrough();

export const cognitiveStateSchema = z.object({
  current: z.enum(stateValues),
  energy: z.enum(energyValues),
  sensory: z.enum(sensoryValues),
  lastTransition: z.string().nullable(),
  history: z.array(transitionEntrySchema),
});

export const sensoryProfileSchema = z.object({
  visual: z.string(),
  auditory: z.string(),
  tactile: z.string(),
  olfactory: z.string(),
});

export const profileSchema = z.object({
  cognitiveStyle: z.string(),
  attentionPattern: z.string(),
  sensoryProfile: sensoryProfileSchema,
  strengths: z.array(z.string()),
  challenges: z.array(z.string()),
  triggers: z.array(z.string()),
  flowConditions: z.array(z.string()),
  recoveryStrategies: z.array(z.string()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const sparkResultsSchema = z.object({
  results: z.object({
    CI: z.number(),
    ER: z.number(),
    SA: z.number(),
    CD: z.number(),
    ED: z.number(),
  }),
  sparkIndex: z.number(),
  profileType: z.string(),
});

export const emotionalEntrySchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  state: z.string(),
  intensity: z.number(),
  notes: z.string().optional(),
}).passthrough();

export const sensoryEntrySchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  visual: z.number(),
  auditory: z.number(),
  tactile: z.number(),
  olfactory: z.number(),
  overall: z.number(),
  notes: z.string().optional(),
}).passthrough();

export const discoverySchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  title: z.string(),
  content: z.string(),
  tags: z.array(z.string()).optional(),
}).passthrough();

// PUT request schema — partial updates allowed
export const putCognitiveStateRequest = z.object({
  cognitiveState: cognitiveStateSchema.optional(),
  profile: profileSchema.partial().optional(),
  emotionalLog: z.array(emotionalEntrySchema).optional(),
  sensoryLog: z.array(sensoryEntrySchema).optional(),
  discoveries: z.array(discoverySchema).optional(),
  sparkResults: sparkResultsSchema.nullable().optional(),
});

// GET response schema
export const cognitiveStateResponse = z.object({
  id: z.string(),
  userId: z.string(),
  cognitiveState: cognitiveStateSchema,
  profile: profileSchema,
  emotionalLog: z.array(emotionalEntrySchema),
  sensoryLog: z.array(sensoryEntrySchema),
  discoveries: z.array(discoverySchema),
  sparkResults: sparkResultsSchema.nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type PutCognitiveStateRequest = z.infer<typeof putCognitiveStateRequest>;
export type CognitiveStateResponse = z.infer<typeof cognitiveStateResponse>;
