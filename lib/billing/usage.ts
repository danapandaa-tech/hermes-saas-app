import { and, eq, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { usageCounters, user } from '@/lib/db/schema'

export const FREE_WORKFLOW_RUNS_PER_MONTH = 15

export type Plan = 'free' | 'paid'

function currentMonth() {
  return new Date().toISOString().slice(0, 7)
}

export async function getPlan(userId: string): Promise<Plan> {
  const [account] = await db
    .select({ tier: user.tier })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1)

  return account?.tier === 'paid' ? 'paid' : 'free'
}

export async function getWorkflowUsage(userId: string) {
  const month = currentMonth()
  const [counter] = await db
    .select({ count: usageCounters.workflowRunsCount })
    .from(usageCounters)
    .where(
      and(
        eq(usageCounters.userId, userId),
        eq(usageCounters.month, month),
      ),
    )
    .limit(1)

  return {
    month,
    completedRuns: counter?.count ?? 0,
    limit: FREE_WORKFLOW_RUNS_PER_MONTH,
  }
}

export async function assertWorkflowRunAvailable(userId: string) {
  if ((await getPlan(userId)) === 'paid') return

  const usage = await getWorkflowUsage(userId)
  if (usage.completedRuns >= usage.limit) {
    throw new Error(
      'You have reached 15 completed workflow runs this month. Chat and capture remain unlimited; upgrade for unlimited automation.',
    )
  }
}

export async function recordCompletedWorkflowRun(userId: string) {
  const month = currentMonth()

  await db
    .insert(usageCounters)
    .values({ userId, month, workflowRunsCount: 1 })
    .onConflictDoUpdate({
      target: [usageCounters.userId, usageCounters.month],
      set: {
        workflowRunsCount: sql`${usageCounters.workflowRunsCount} + 1`,
      },
    })
}
