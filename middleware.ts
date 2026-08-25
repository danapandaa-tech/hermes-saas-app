import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Better Auth sets this cookie name by default
const SESSION_COOKIE = 'better-auth.session_token'

export async function middleware(request: NextRequest) {
  const hasSession = request.cookies.has(SESSION_COOKIE)

  // Public paths that don't need auth
  const publicPaths = ['/auth', '/api/auth']
  const isPublic = publicPaths.some((p) =>
    request.nextUrl.pathname.startsWith(p),
  )

  // Allow static assets and public paths through
  if (isPublic) {
    // If already logged in and visiting /auth, redirect to home
    if (hasSession && request.nextUrl.pathname === '/auth') {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  // Redirect to login if no session cookie
  if (!hasSession) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
