/**
 * lib/cognitive/cognitiveDb.ts
 * Data access layer for cognitive state persistence.
 * Handles reading/writing the cognitive document per user.
 */
import { db } from '@/lib/db';
import { cognitiveState } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { createInitialState } from './stateMachine';
import { createProfile } from './cognitiveMap';

function generateId(): string {
  return `cog_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Load the cognitive document for a user.
 * Returns a default empty state if no record exists.
 */
export async function loadCognitiveState(userId: string) {
  try {
    const rows = await db
      .select()
      .from(cognitiveState)
      .where(eq(cognitiveState.userId, userId))
      .limit(1);

    if (rows.length === 0) {
      // Return default state (don't create yet — will be created on first PUT)
      return {
        id: '',
        userId,
        cognitiveState: createInitialState(),
        profile: createProfile(),
        emotionalLog: [],
        sensoryLog: [],
        discoveries: [],
        sparkResults: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    const row = rows[0];
    return {
      id: row.id,
      userId: row.userId,
      cognitiveState: row.cognitiveState,
      profile: row.profile,
      emotionalLog: row.emotionalLog,
      sensoryLog: row.sensoryLog,
      discoveries: row.discoveries,
      sparkResults: row.sparkResults ?? null,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error('[cognitive] Failed to load cognitive state:', error);
    throw error;
  }
}

/**
 * Save (upsert) the cognitive document for a user.
 * Creates the record if it doesn't exist, updates if it does.
 */
export async function saveCognitiveState(
  userId: string,
  data: {
    cognitiveState?: unknown;
    profile?: unknown;
    emotionalLog?: unknown[];
    sensoryLog?: unknown[];
    discoveries?: unknown[];
    sparkResults?: unknown | null;
  }
) {
  try {
    const existing = await db
      .select()
      .from(cognitiveState)
      .where(eq(cognitiveState.userId, userId))
      .limit(1);

    if (existing.length === 0) {
      // INSERT new record
      const id = generateId();
      await db.insert(cognitiveState).values({
        id,
        userId,
        cognitiveState: (data.cognitiveState as any) ?? createInitialState(),
        profile: (data.profile as any) ?? createProfile(),
        emotionalLog: (data.emotionalLog as any) ?? [],
        sensoryLog: (data.sensoryLog as any) ?? [],
        discoveries: (data.discoveries as any) ?? [],
        sparkResults: (data.sparkResults as any) ?? null,
      });
      return { id, created: true };
    }

    // UPDATE existing record
    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (data.cognitiveState !== undefined) updateData.cognitiveState = data.cognitiveState;
    if (data.profile !== undefined) updateData.profile = data.profile;
    if (data.emotionalLog !== undefined) updateData.emotionalLog = data.emotionalLog;
    if (data.sensoryLog !== undefined) updateData.sensoryLog = data.sensoryLog;
    if (data.discoveries !== undefined) updateData.discoveries = data.discoveries;
    if (data.sparkResults !== undefined) updateData.sparkResults = data.sparkResults;

    await db
      .update(cognitiveState)
      .set(updateData)
      .where(eq(cognitiveState.userId, userId));

    return { id: existing[0].id, created: false };
  } catch (error) {
    console.error('[cognitive] Failed to save cognitive state:', error);
    throw error;
  }
}
