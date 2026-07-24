import { and, count, eq, gte, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { projects, subscriptions, usageEvents, workflows } from '@/lib/db/schema'

export const FREE_LIMITS = {
  messagesPerMonth: 100,
  projects: 3,
  workflows: 5,
} as const

export type Plan = 'free' | 'paid'
export type UsageKind = 'message' | 'workflow_run'

export async function getPlan(userId: string): Promise<Plan> {
  const [subscription] = await db
    .select({ status: subscriptions.status })
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .limit(1)

  return subscription && ['active', 'trialing'].includes(subscription.status) ? 'paid' : 'free'
}

export async function getUsageSummary(userId: string) {
  const monthStart = new Date()
  monthStart.setUTCDate(1)
  monthStart.setUTCHours(0, 0, 0, 0)

  const [[messageUsage], [projectUsage], [workflowUsage]] = await Promise.all([
    db
      .select({ total: sql<number>`coalesce(sum(${usageEvents.quantity}), 0)::int` })
      .from(usageEvents)
      .where(and(eq(usageEvents.userId, userId), eq(usageEvents.kind, 'message'), gte(usageEvents.createdAt, monthStart))),
    db.select({ total: count() }).from(projects).where(eq(projects.userId, userId)),
    db.select({ total: count() }).from(workflows).where(eq(workflows.userId, userId)),
  ])

  return {
    messages: messageUsage?.total ?? 0,
    projects: projectUsage?.total ?? 0,
    workflows: workflowUsage?.total ?? 0,
  }
}

export async function assertWithinLimit(
  userId: string,
  resource: keyof typeof FREE_LIMITS,
) {
  if ((await getPlan(userId)) === 'paid') return
  const usage = await getUsageSummary(userId)
  if (usage[resource] >= FREE_LIMITS[resource]) {
    throw new Error(`Free plan limit reached for ${resource}`)
  }
}

export async function recordUsage(userId: string, kind: UsageKind, quantity = 1) {
  await db.insert(usageEvents).values({
    id: crypto.randomUUID(),
    userId,
    kind,
    quantity,
  })
}
