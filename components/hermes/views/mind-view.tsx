'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/use-auth'
import { Activity, Heart, Eye, Hexagon, Sparkles, Compass, BookOpen, Lightbulb, Settings2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MindDashboard } from '@/components/hermes/mind/mind-dashboard'
import { MindEmotional } from '@/components/hermes/mind/mind-emotional'
import { MindSensory } from '@/components/hermes/mind/mind-sensory'
import { MindPatterns } from '@/components/hermes/mind/mind-patterns'
import { MindSpark } from '@/components/hermes/mind/mind-spark'
import { MindDiscoveries } from '@/components/hermes/mind/mind-discoveries'
import { MindRecommendations } from '@/components/hermes/mind/mind-recommendations'
import { usePatternNotifications } from '@/components/hermes/mind/use-pattern-notifications'

type MindTab = 'dashboard' | 'emotional' | 'sensory' | 'patterns' | 'spark' | 'discoveries' | 'recommendations'

const tabs: { id: MindTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Activity },
  { id: 'emotional', label: 'Emotional', icon: Heart },
  { id: 'sensory', label: 'Sensory', icon: Eye },
  { id: 'patterns', label: 'Patterns', icon: Hexagon },
  { id: 'spark', label: 'SPARK', icon: Sparkles },
  { id: 'discoveries', label: 'Discoveries', icon: Lightbulb },
  { id: 'recommendations', label: 'Personal OS', icon: Settings2 },
]

export function MindView() {
  const { isAuthenticated } = useAuth()
  usePatternNotifications()
  const [activeTab, setActiveTab] = useState<MindTab>('dashboard')

  return (
    <div className="flex h-full flex-col">
      {/* Sub-navigation tabs */}
      <div className="flex items-center gap-1 border-b border-border px-4 sm:px-6 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 border-b-2 px-3 py-3 text-sm font-medium transition-colors',
                isActive
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="size-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Auth banner */}
      {!isAuthenticated && (
        <div className="mx-4 mt-4 sm:mx-6 rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3">
          <p className="text-sm text-amber-300">
            <span className="font-medium">Not signed in.</span>{' '}
            Your cognitive data is stored locally only.{' '}
            <a href="/auth" className="underline hover:text-amber-200">Sign in</a>{' '}
            to sync across devices.
          </p>
        </div>
      )}

      {/* Tab content */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        {activeTab === 'dashboard' && <MindDashboard />}
        {activeTab === 'emotional' && <MindEmotional />}
        {activeTab === 'sensory' && <MindSensory />}
        {activeTab === 'patterns' && <MindPatterns />}
        {activeTab === 'spark' && <MindSpark />}
        {activeTab === 'discoveries' && <MindDiscoveries />}
        {activeTab === 'recommendations' && <MindRecommendations />}
      </div>
    </div>
  )
}
