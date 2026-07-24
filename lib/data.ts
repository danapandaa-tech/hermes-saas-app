import 'server-only'

import { and, count, desc, eq, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import {
  messages,
  subscriptions,
  usageCounters,
  usageEvents,
  user,
  workflows,
  workspaces,
} from '@/lib/db/schema'
import { currentUsagePeriod, FREE_LIMITS, isPaidSubscription } from '@/lib/plans'

export async function getWorkspaceData(userId: string) {
  const month = currentUsagePeriod()

  const [workspaceRows, subscriptionRows, counterRows] = await Promise.all([
    db
      .select()
      .from(workspaces)
      .where(eq(workspaces.userId, userId))
      .orderBy(desc(workspaces.createdAt)),
    db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .limit(1),
    db
      .select()
      .from(usageCounters)
      .where(
        and(
          eq(usageCounters.userId, userId),
          eq(usageCounters.month, month),
        ),
      )
      .limit(1),
  ])

  const subscription = subscriptionRows[0] ?? null
  const tier = isPaidSubscription(subscription?.status) ? 'paid' : 'free'

  return {
    workspaces: workspaceRows,
    subscription,
    tier: tier as 'free' | 'paid',
    workflowRunsCount: counterRows[0]?.workflowRunsCount ?? 0,
    workflowRunsLimit: tier === 'paid' ? null : FREE_LIMITS.workflowRunsPerMonth,
  }
}

export async function getWorkspaceMessages(userId: string, workspaceId: string) {
  const ownedWorkspace = await db
    .select({ id: workspaces.id })
    .from(workspaces)
    .where(and(eq(workspaces.id, workspaceId), eq(workspaces.userId, userId)))
    .limit(1)

  if (!ownedWorkspace[0]) throw new Error('Workspace not found')

  return db
    .select()
    .from(messages)
    .where(eq(messages.workspaceId, workspaceId))
    .orderBy(messages.createdAt)
}

export async function createMessage(
  userId: string,
  input: { workspaceId: string; role: 'user' | 'assistant'; content: string },
) {
  const ownedWorkspace = await db
    .select({ id: workspaces.id })
    .from(workspaces)
    .where(
      and(
        eq(workspaces.id, input.workspaceId),
        eq(workspaces.userId, userId),
      ),
    )
    .limit(1)

  if (!ownedWorkspace[0]) throw new Error('Workspace not found')

  const [message] = await db
    .insert(messages)
    .values({ id: crypto.randomUUID(), ...input })
    .returning()

  return message
}

export async function canCreateWorkspace(userId: string) {
  const [tierRows, workspaceCount] = await Promise.all([
    db.select({ tier: user.tier }).from(user).where(eq(user.id, userId)).limit(1),
    db
      .select({ value: count() })
      .from(workspaces)
      .where(eq(workspaces.userId, userId)),
  ])

  return (
    tierRows[0]?.tier === 'paid' ||
    Number(workspaceCount[0]?.value ?? 0) < FREE_LIMITS.workspaces
  )
}

export async function canRunWorkflow(userId: string) {
  const month = currentUsagePeriod()
  const [tierRows, counterRows] = await Promise.all([
    db.select({ tier: user.tier }).from(user).where(eq(user.id, userId)).limit(1),
    db
      .select({ count: usageCounters.workflowRunsCount })
      .from(usageCounters)
      .where(
        and(
          eq(usageCounters.userId, userId),
          eq(usageCounters.month, month),
        ),
      )
      .limit(1),
  ])

  return (
    tierRows[0]?.tier === 'paid' ||
    (counterRows[0]?.count ?? 0) < FREE_LIMITS.workflowRunsPerMonth
  )
}

export async function recordWorkflowRun(userId: string, workflowId: string) {
  const month = currentUsagePeriod()
  const ownedWorkflow = await db
    .select({ id: workflows.id })
    .from(workflows)
    .where(and(eq(workflows.id, workflowId), eq(workflows.userId, userId)))
    .limit(1)

  if (!ownedWorkflow[0]) throw new Error('Workflow not found')
  if (!(await canRunWorkflow(userId))) return { allowed: false as const }

  await db.transaction(async (tx) => {
    await tx.insert(usageEvents).values({
      id: crypto.randomUUID(),
      userId,
      kind: 'workflow.completed',
      quantity: 1,
    })

    await tx
      .insert(usageCounters)
      .values({ userId, month, workflowRunsCount: 1 })
      .onConflictDoUpdate({
        target: [usageCounters.userId, usageCounters.month],
        set: {
          workflowRunsCount: sql`${usageCounters.workflowRunsCount} + 1`,
          updatedAt: new Date(),
        },
      })
  })

  return { allowed: true as const }
}
