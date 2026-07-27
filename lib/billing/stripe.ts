import 'server-only'
import Stripe from 'stripe'

export const PAID_PLAN = {
  id: 'hermes-paid-monthly',
  name: 'Hermes Paid',
  description: 'Unlimited messages, projects, workflows, and all integrations.',
  priceInCents: 1200,
  interval: 'month' as const,
}

export function getStripe(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) return null
  return new Stripe(secretKey)
}

export function requireStripe(): Stripe {
  const s = getStripe()
  if (!s) throw new Error('STRIPE_SECRET_KEY is not configured')
  return s
}

export function getAppUrl() {
  const raw =
    process.env.BETTER_AUTH_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined) ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ??
    process.env.V0_RUNTIME_URL ??
    'http://localhost:3000'
  return raw.replace(/\/$/, '')
}
