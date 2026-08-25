'use client'

import { useSession } from '@/lib/auth-client'

/**
 * Client-side auth hook — wraps Better Auth's useSession.
 * Drop-in replacement for the old mock useAuth.
 */
export function useAuth() {
  const { data: session, isPending } = useSession({
    refetchInterval: false,
    refetchOnWindowFocus: false,
  })

  const user = session?.user ?? null
  const userId = user?.id ?? ''

  return {
    user,
    userId,
    isAuthenticated: !!user,
    isLoading: isPending,
  }
}
