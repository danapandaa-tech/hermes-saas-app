// Mock auth context - to be replaced with real Better Auth when BETTER_AUTH_SECRET is set

export type User = {
  id: string
  email: string
  name: string
  avatar?: string
}

export type Session = {
  user: User
  expires: Date
}

// Placeholder user for development - replace with real auth later
export const MOCK_USER: User = {
  id: 'user_placeholder',
  email: 'you@example.com',
  name: 'Ada Maro',
  avatar: 'AM',
}

export const MOCK_SESSION: Session = {
  user: MOCK_USER,
  expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
}

// Get current user - placeholder until real auth is implemented
export function getCurrentUser(): User {
  return MOCK_USER
}

// Get current session - placeholder until real auth is implemented
export function getCurrentSession(): Session {
  return MOCK_SESSION
}

// Get current user ID for database queries
export function getCurrentUserId(): string {
  return MOCK_USER.id
}
