'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { useCognitive } from './use-cognitive'
import { cognitiveStyles, attentionPatterns } from '@/lib/cognitive/cognitiveMap'

export function MindRecommendations() {
  const store = useCognitive()
  const recommendations = store.getRecommendations()
  const map = store.getCognitiveMap()
  const profile = store.profile
  const { cognitiveStyle, attentionPattern, strengths = [], challenges = [], flowConditions = [], recoveryStrategies = [] } = profile

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-medium tracking-tight text-foreground">Personal OS</h2>
        <p className="text-sm text-muted-foreground">
          Recommendations based on your cognitive profile and patterns
        </p>
      </div>

      {/* Live Recommendations */}
      {recommendations.length > 0 && (
        <section className="rounded-lg border border-primary/30 bg-card p-4">
          <h3 className="text-sm font-medium text-foreground mb-3">Current Guidance</h3>
          <ul className="space-y-2">
            {recommendations.map((r, i) => (
              <li key={i} className="text-sm text-foreground flex gap-2">
                <span className="text-primary">→</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Profile Configuration */}
      <section className="rounded-lg border border-border bg-card p-4">
        <h3 className="text-sm font-medium text-foreground mb-3">Cognitive Profile</h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">Thinking Style</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(cognitiveStyles).map(([key, val]) => (
                <button
                  key={val}
                  onClick={() => store.updateProfile({ cognitiveStyle: val })}
                  className={`px-3 py-2 rounded-lg text-sm capitalize transition-all ${
                    cognitiveStyle === val
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {key.toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">Attention Pattern</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(attentionPatterns).map(([key, val]) => (
                <button
                  key={val}
                  onClick={() => store.updateProfile({ attentionPattern: val })}
                  className={`px-3 py-2 rounded-lg text-sm capitalize transition-all ${
                    attentionPattern === val
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {key.replace(/_/g, ' ').toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Strengths & Challenges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TagSection
          label="Strengths"
          items={strengths}
          onAdd={(v) => store.updateProfile({ strengths: [...strengths, v] })}
          onRemove={(v) => store.updateProfile({ strengths: strengths.filter((s) => s !== v) })}
          color="bg-emerald-500/15 text-emerald-600"
        />
        <TagSection
          label="Challenges"
          items={challenges}
          onAdd={(v) => store.updateProfile({ challenges: [...challenges, v] })}
          onRemove={(v) => store.updateProfile({ challenges: challenges.filter((c) => c !== v) })}
          color="bg-amber-500/15 text-amber-600"
        />
      </div>

      {/* Flow & Recovery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TagSection
          label="Flow Conditions"
          items={flowConditions}
          onAdd={(v) => store.updateProfile({ flowConditions: [...flowConditions, v] })}
          onRemove={(v) => store.updateProfile({ flowConditions: flowConditions.filter((f) => f !== v) })}
          color="bg-cyan-500/15 text-cyan-600"
        />
        <TagSection
          label="Recovery Strategies"
          items={recoveryStrategies}
          onAdd={(v) => store.updateProfile({ recoveryStrategies: [...recoveryStrategies, v] })}
          onRemove={(v) => store.updateProfile({ recoveryStrategies: recoveryStrategies.filter((r) => r !== v) })}
          color="bg-purple-500/15 text-purple-600"
        />
      </div>

      {/* Map Summary */}
      {map && map.totalEntries > 0 && (
        <section className="rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm font-medium text-foreground mb-3">Map Summary</h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>{map.totalEntries} transitions tracked</p>
            {Object.entries(map.stateFrequency || {}).map(([state, count]) => (
              <div key={state} className="flex justify-between">
                <span className="capitalize">{state}</span>
                <span className="text-muted-foreground">{count}x</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function TagSection({ label, items, onAdd, onRemove, color }: {
  label: string
  items: string[]
  onAdd: (v: string) => void
  onRemove: (v: string) => void
  color: string
}) {
  const [val, setVal] = useState('')
  
  const handleAdd = () => {
    if (val.trim()) {
      onAdd(val.trim())
      setVal('')
    }
  }

  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <h3 className="text-sm font-medium text-foreground mb-2">{label}</h3>
      <div className="flex flex-wrap gap-1 mb-2">
        {items.map((item, i) => (
          <span key={i} className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${color}`}>
            {item}
            <button onClick={() => onRemove(item)} className="hover:opacity-70">
              <X className="size-3" />
            </button>
          </span>
        ))}
        {items.length === 0 && (
          <span className="text-xs text-muted-foreground">None yet</span>
        )}
      </div>
      <div className="flex gap-1">
        <input
          type="text"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Add..."
          className="flex-1 rounded-lg border border-border bg-background px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button onClick={handleAdd} className="rounded-lg bg-primary px-2 py-1 text-primary-foreground">
          <Plus className="size-3" />
        </button>
      </div>
    </section>
  )
}
