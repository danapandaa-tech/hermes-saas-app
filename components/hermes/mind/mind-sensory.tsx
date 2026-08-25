'use client'

import { useState } from 'react'
import { useCognitive } from './use-cognitive'

const CHANNELS = [
  { id: 'visual', label: 'Visual', icon: '\uD83D\uDC41', desc: 'Light, movement, clutter' },
  { id: 'auditory', label: 'Auditory', icon: '\uD83D\uDC42', desc: 'Noise, voices, music' },
  { id: 'tactile', label: 'Tactile', icon: '\u270B', desc: 'Texture, temperature, clothing' },
  { id: 'proprioceptive', label: 'Body', icon: '\uD83E\uDDCD', desc: 'Movement, pressure, position' },
  { id: 'interoceptive', label: 'Internal', icon: '\uD83D\uDC93', desc: 'Hunger, heartbeat, breath' },
]

const LEVELS = ['low', 'moderate', 'high', 'overload'] as const

export function MindSensory() {
  const { logSensoryState, sensoryLog } = useCognitive()
  const [levels, setLevels] = useState<Record<string, string>>({})
  const [notes, setNotes] = useState('')

  const handleLog = () => {
    const overall = Object.values(levels).reduce((sum, l) => {
      return sum + (l === 'overload' ? 4 : l === 'high' ? 3 : l === 'moderate' ? 2 : 1)
    }, 0) / Math.max(Object.keys(levels).length, 1)

    logSensoryState({
      visual: levels.visual === 'overload' ? 4 : levels.visual === 'high' ? 3 : levels.visual === 'moderate' ? 2 : 1,
      auditory: levels.auditory === 'overload' ? 4 : levels.auditory === 'high' ? 3 : levels.auditory === 'moderate' ? 2 : 1,
      tactile: levels.tactile === 'overload' ? 4 : levels.tactile === 'high' ? 3 : levels.tactile === 'moderate' ? 2 : 1,
      olfactory: 0,
      overall: Math.round(overall * 10) / 10,
      notes: notes.trim() || undefined,
    })
    setLevels({}); setNotes('')
  }

  const recent = sensoryLog.slice(-5).reverse()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-medium tracking-tight text-foreground">Sensory Check-In</h2>
        <p className="text-sm text-muted-foreground">Track your sensory load and environment</p>
      </div>

      <section className="rounded-lg border border-border bg-card p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">Sensory Load by Channel</p>
        <div className="space-y-3">
          {CHANNELS.map((ch) => (
            <div key={ch.id} className="flex items-center gap-3">
              <span className="text-lg w-8">{ch.icon}</span>
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-foreground">{ch.label}</span>
                  <span className="text-muted-foreground text-xs">{ch.desc}</span>
                </div>
                <div className="flex gap-1">
                  {LEVELS.map((level) => (
                    <button key={level} onClick={() => setLevels({ ...levels, [ch.id]: level })}
                      className={`flex-1 py-1 rounded text-xs capitalize transition-all ${
                        levels[ch.id] === level
                          ? level === 'overload' ? 'bg-red-500/20 text-red-400'
                            : level === 'high' ? 'bg-amber-500/20 text-amber-400'
                            : level === 'moderate' ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                      }`}
                    >{level}</button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card p-4">
        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1 block">Notes (optional)</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
          placeholder="Anything notable about your sensory state..."
          className="flex w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 h-20 resize-none" />
        <button onClick={handleLog} className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors mt-3">Log Check-In</button>
      </section>

      {recent.length > 0 && (
        <section className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">Recent Check-Ins</p>
          <div className="space-y-3">
            {recent.map((entry: any) => (
              <div key={entry.id} className="text-sm border-b border-border pb-2 last:border-0">
                <span className="text-muted-foreground text-xs">{new Date(entry.timestamp).toLocaleTimeString()}</span>
                {entry.notes && <p className="text-muted-foreground mt-1 text-xs">{entry.notes}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
