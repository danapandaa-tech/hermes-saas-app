import 'server-only'
import { getAppUrl, getStripe, PAID_PLAN } from './stripe'
import { getSubscription } from './subscriptions'

export async function createSubscriptionCheckout(input: {
  userId: string
  email: string
}) {
  const stripe = getStripe()
  const appUrl = getAppUrl()
  const existing = await getSubscription(input.userId)

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: existing?.stripeCustomerId ?? undefined,
    customer_email: existing?.stripeCustomerId ? undefined : input.email,
    client_reference_id: input.userId,
    metadata: { userId: input.userId },
    subscription_data: { metadata: { userId: input.userId } },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: PAID_PLAN.priceInCents,
          recurring: { interval: PAID_PLAN.interval },
          product_data: {
            name: PAID_PLAN.name,
            description: PAID_PLAN.description,
          },
        },
      },
    ],
    success_url: `${appUrl}/?billing=success`,
    cancel_url: `${appUrl}/?billing=canceled`,
  })

  if (!session.url) throw new Error('Stripe Checkout did not return a URL')
  return session.url
}

export async function createBillingPortal(userId: string) {
  const subscription = await getSubscription(userId)
  if (!subscription?.stripeCustomerId) {
    throw new Error('No Stripe customer exists for this account')
  }

  const session = await getStripe().billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: `${getAppUrl()}/`,
  })

  return session.url
}
