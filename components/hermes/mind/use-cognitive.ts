'use client'

import { useEffect, useRef } from 'react'
import { useCognitiveStore, type CognitiveStore } from '@/lib/cognitive/useCognitiveStore'

/**
 * Client-side hook that wraps the Zustand cognitive store and adds
 * automatic persistence via the /api/cognitive/state endpoint.
 *
 * Usage: const store = useCognitive()
 * Then access: store.cognitiveState, store.changeState(), etc.
 */
export function useCognitive() {
  const store = useCognitiveStore()
  const initialized = useRef(false)

  // Load from API on mount
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    fetch('/api/cognitive/state')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data || !data.id) return // No saved state yet — use defaults
        useCognitiveStore.setState({
          cognitiveState: data.cognitiveState,
          profile: data.profile,
          emotionalLog: data.emotionalLog ?? [],
          sensoryLog: data.sensoryLog ?? [],
          discoveries: data.discoveries ?? [],
          sparkAssessmentResults: data.sparkResults ?? null,
          showOnboarding: false,
        })
      })
      .catch((err) => console.error('[cognitive] Failed to load:', err))
  }, [])

  // Auto-save on state changes (debounced)
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!initialized.current) return
      const s = useCognitiveStore.getState()
      fetch('/api/cognitive/state', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cognitiveState: s.cognitiveState,
          profile: s.profile,
          emotionalLog: s.emotionalLog,
          sensoryLog: s.sensoryLog,
          discoveries: s.discoveries,
          sparkResults: s.sparkAssessmentResults,
        }),
      }).catch((err) => console.error('[cognitive] Failed to save:', err))
    }, 1000)
    return () => clearTimeout(timeout)
  }, [
    store.cognitiveState,
    store.profile,
    store.emotionalLog,
    store.sensoryLog,
    store.discoveries,
    store.sparkAssessmentResults,
  ])

  return store
}
