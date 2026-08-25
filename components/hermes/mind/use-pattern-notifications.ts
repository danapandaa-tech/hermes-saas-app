'use client'

import { useEffect, useRef } from 'react'
import { useCognitive } from './use-cognitive'
import { useNotificationStore } from '@/lib/notification-store'

/**
 * Hook that monitors cognitive patterns and creates notifications
 * when significant patterns are detected.
 */
export function usePatternNotifications() {
  const store = useCognitive()
  const addNotification = useNotificationStore((state) => state.addNotification)
  const lastNotifiedRef = useRef<string[]>([])

  useEffect(() => {
    const patterns = store.getPatterns()
    const recommendations = store.getRecommendations()
    
    if (!patterns || !recommendations) return

    // Notify about detected patterns
    if (patterns.warnings && patterns.warnings.length > 0) {
      patterns.warnings.forEach((warning: string) => {
        const key = `pattern_${warning.slice(0, 20)}`
        if (!lastNotifiedRef.current.includes(key)) {
          addNotification({
            type: 'pattern',
            title: 'Pattern Detected',
            message: warning,
          })
          lastNotifiedRef.current.push(key)
        }
      })
    }

    // Notify about new recommendations
    if (recommendations.length > 0) {
      const latestRecommendation = recommendations[0]
      const key = `rec_${latestRecommendation.slice(0, 20)}`
      if (!lastNotifiedRef.current.includes(key)) {
        addNotification({
          type: 'insight',
          title: 'New Guidance',
          message: latestRecommendation,
        })
        lastNotifiedRef.current.push(key)
      }
    }
  }, [store.cognitiveState, store.emotionalLog, store.sensoryLog])
}
