'use client'

import { getCurrentUser, getCurrentUserId, type User } from '@/lib/auth-context'

export function useAuth() {
  const user = getCurrentUser()
  const userId = getCurrentUserId()

  return {
    user,
    userId,
    isAuthenticated: !!user,
  }
}
