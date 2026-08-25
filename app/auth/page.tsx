'use client'

import { useState } from 'react'
import { signIn, signUp } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function AuthPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'signup') {
        const res = await signUp.email({
          email,
          password,
          name: name || email.split('@')[0],
        })
        if (res.error) {
          setError(res.error.message || 'Signup failed')
          setLoading(false)
          return
        }
      } else {
        const res = await signIn.email({
          email,
          password,
        })
        if (res.error) {
          setError(res.error.message || 'Sign-in failed')
          setLoading(false)
          return
        }
      }

      router.push('/')
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/20 ring-1 ring-primary/35">
            <svg viewBox="0 0 24 24" fill="none" className="size-6 text-primary" aria-hidden="true">
              <line x1="12" y1="3" x2="12" y2="21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M8.5 5.5 Q12 3.5 15.5 5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none" />
              <path d="M12 7 Q8 9 10 12 Q7 15 12 17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
              <path d="M12 7 Q16 9 14 12 Q17 15 12 17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
              <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            </svg>
          </div>
          <div className="text-center">
            <h1 className="font-heading text-2xl font-medium tracking-tight text-foreground">
              Hermes
            </h1>
            <p className="text-sm text-muted-foreground">
              {mode === 'signin' ? 'Welcome back' : 'Create your workspace'}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {mode === 'signup' && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            required
            minLength={8}
          />

          {error && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Toggle */}
        <p className="mt-4 text-center text-xs text-muted-foreground">
          {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'signin' ? 'signup' : 'signin')
              setError('')
            }}
            className="font-medium text-primary hover:underline"
          >
            {mode === 'signin' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  )
}
