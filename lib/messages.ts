import { db } from '@/lib/db'
import { messages } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

const WORKSPACE_ID = 'default' // Default workspace

export async function saveMessage(
  role: 'user' | 'assistant',
  content: string
) {
  try {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    await db.insert(messages).values({
      id,
      workspaceId: WORKSPACE_ID,
      role,
      content,
    })
    return { id, role, content }
  } catch (error) {
    console.error('[v0] Failed to save message:', error)
    return { id: `${Date.now()}`, role, content }
  }
}

export async function loadMessages() {
  try {
    const rows = await db
      .select()
      .from(messages)
      .where(eq(messages.workspaceId, WORKSPACE_ID))
      .orderBy(messages.createdAt)
    return rows.map((m) => ({
      id: m.id,
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }))
  } catch (error) {
    console.error('[v0] Failed to load messages:', error)
    return []
  }
}
