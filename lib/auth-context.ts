import { headers } from 'next/headers'
import { auth } from '@/lib/auth'

export type AuthUser = {
  id: string
  email: string
  name: string
  image?: string | null
  tier: string
}

/**
 * Server-side helper — call from Server Components, API routes, or Server Actions.
 * Returns `null` when no valid session exists.
 */
export async function getServerAuth(): Promise<{ user: AuthUser; session: object } | null> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })
    if (!session) return null

    return {
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
        tier: (session.user as any).tier ?? 'free',
      },
      session: session.session,
    }
  } catch {
    return null
  }
}

/**
 * Server-side helper that redirects to /auth when unauthenticated.
 * Use in pages that require a logged-in user.
 */
export async function requireAuth(): Promise<{ user: AuthUser; session: object }> {
  const result = await getServerAuth()
  if (!result) {
    throw new Error('UNAUTHORIZED')
  }
  return result
}
