import type Stripe from 'stripe'
import { getStripe } from '@/lib/billing/stripe'
import { upsertSubscriptionFromStripe } from '@/lib/billing/subscriptions'

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    return Response.json({ error: 'Stripe webhook is not configured' }, { status: 503 })
  }

  const signature = request.headers.get('stripe-signature')
  if (!signature) {
    return Response.json({ error: 'Missing Stripe signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(
      await request.text(),
      signature,
      webhookSecret,
    )
  } catch {
    return Response.json({ error: 'Invalid Stripe signature' }, { status: 400 })
  }

  if (
    event.type === 'customer.subscription.created' ||
    event.type === 'customer.subscription.updated' ||
    event.type === 'customer.subscription.deleted'
  ) {
    await upsertSubscriptionFromStripe(event.data.object)
  }

  return Response.json({ received: true })
}
