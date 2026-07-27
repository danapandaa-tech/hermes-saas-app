import { eq } from 'drizzle-orm'
import type Stripe from 'stripe'
import { db } from '@/lib/db'
import { subscriptions, user } from '@/lib/db/schema'

export async function getSubscription(userId: string) {
  const [subscription] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .limit(1)
  return subscription ?? null
}

export async function syncCheckoutCustomer(session: Stripe.Checkout.Session) {
  const userId = session.client_reference_id ?? session.metadata?.userId
  const stripeCustomerId =
    typeof session.customer === 'string' ? session.customer : session.customer?.id

  if (!userId || !stripeCustomerId) return

  await db
    .update(user)
    .set({ stripeCustomerId, updatedAt: new Date() })
    .where(eq(user.id, userId))
}

export async function upsertSubscriptionFromStripe(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId
  if (!userId) throw new Error('Stripe subscription is missing userId metadata')

  const firstItem = subscription.items.data[0]
  const periodEnd = firstItem?.current_period_end
    ? new Date(firstItem.current_period_end * 1000)
    : null

  const stripeCustomerId =
    typeof subscription.customer === 'string'
      ? subscription.customer
      : subscription.customer.id
  const isPaid = ['active', 'trialing'].includes(subscription.status)

  await db
    .insert(subscriptions)
    .values({
      id: crypto.randomUUID(),
      userId,
      stripeCustomerId,
      stripeSubscriptionId: subscription.id,
      stripePriceId: firstItem?.price.id ?? null,
      status: subscription.status,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: subscriptions.userId,
      set: {
        stripeCustomerId:
          typeof subscription.customer === 'string'
            ? subscription.customer
            : subscription.customer.id,
        stripeSubscriptionId: subscription.id,
        stripePriceId: firstItem?.price.id ?? null,
        status: subscription.status,
        currentPeriodEnd: periodEnd,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        updatedAt: new Date(),
      },
    })

  await db
    .update(user)
    .set({
      stripeCustomerId,
      tier: isPaid ? 'paid' : 'free',
      updatedAt: new Date(),
    })
    .where(eq(user.id, userId))
}
