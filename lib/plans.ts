export const FREE_LIMITS = {
  workflowRunsPerMonth: 15,
  workspaces: 1,
} as const

export const PAID_PLAN = {
  name: 'Hermes Pro',
  priceInCents: 1200,
  interval: 'month' as const,
  description: 'Unlimited workflow runs, multiple workspaces, and connected integrations.',
} as const

export type PlanKey = 'free' | 'pro'

export function isPaidSubscription(status: string | null | undefined) {
  return status === 'active' || status === 'trialing'
}

export function currentUsagePeriod(date = new Date()) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`
}
