'use client'

import { useState } from 'react'
import { useCognitive } from './use-cognitive'

const EMOTIONS = [
  { id: 'calm', label: 'Calm', color: 'bg-emerald-500/15 text-emerald-400' },
  { id: 'anxious', label: 'Anxious', color: 'bg-amber-500/15 text-amber-400' },
  { id: 'frustrated', label: 'Frustrated', color: 'bg-red-500/15 text-red-400' },
  { id: 'excited', label: 'Excited', color: 'bg-cyan-500/15 text-cyan-400' },
  { id: 'sad', label: 'Sad', color: 'bg-blue-500/15 text-blue-400' },
  { id: 'angry', label: 'Angry', color: 'bg-rose-500/15 text-rose-400' },
  { id: 'hopeful', label: 'Hopeful', color: 'bg-green-500/15 text-green-400' },
  { id: 'numb', label: 'Numb', color: 'bg-muted text-muted-foreground' },
  { id: 'overwhelmed', label: 'Overwhelmed', color: 'bg-purple-500/15 text-purple-400' },
  { id: 'content', label: 'Content', color: 'bg-teal-500/15 text-teal-400' },
]

export function MindEmotional() {
  const { logEmotionalState, emotionalLog } = useCognitive()
  const [selected, setSelected] = useState<string | null>(null)
  const [trigger, setTrigger] = useState('')
  const [strategy, setStrategy] = useState('')
  const [intensity, setIntensity] = useState(5)

  const handleLog = () => {
    if (!selected) return
    logEmotionalState({ state: selected, intensity, notes: [trigger, strategy].filter(Boolean).join(' | ') })
    setSelected(null); setTrigger(''); setStrategy(''); setIntensity(5)
  }

  const recent = emotionalLog.slice(-5).reverse()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-medium tracking-tight text-foreground">Emotional Navigator</h2>
        <p className="text-sm text-muted-foreground">Track your emotional states and triggers</p>
      </div>

      <section className="rounded-lg border border-border bg-card p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">How are you feeling?</p>
        <div className="flex flex-wrap gap-2">
          {EMOTIONS.map((e) => (
            <button key={e.id} onClick={() => setSelected(e.id)}
              className={`px-3 py-1.5 rounded-full text-sm capitalize transition-all ${
                selected === e.id ? e.color + ' ring-2 ring-primary/50' : 'bg-muted/50 text-muted-foreground hover:text-foreground'
              }`}
            >{e.label}</button>
          ))}
        </div>
      </section>

      {selected && (
        <section className="rounded-lg border border-border bg-card p-4 space-y-4">
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1 block">What triggered this?</label>
            <input type="text" value={trigger} onChange={(e) => setTrigger(e.target.value)}
              placeholder="e.g., sudden noise, task switch, memory..."
              className="flex h-9 w-full rounded-lg border border-border bg-background px-3 py-1 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1 block">What helped or might help?</label>
            <input type="text" value={strategy} onChange={(e) => setStrategy(e.target.value)}
              placeholder="e.g., deep breath, walk, music..."
              className="flex h-9 w-full rounded-lg border border-border bg-background px-3 py-1 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1 block">Intensity: {intensity}/10</label>
            <input type="range" min="1" max="10" value={intensity} onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full accent-primary" />
          </div>
          <button onClick={handleLog} className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">Log Entry</button>
        </section>
      )}

      {recent.length > 0 && (
        <section className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">Recent Entries</p>
          <div className="space-y-3">
            {recent.map((entry: any) => {
              const emotion = EMOTIONS.find((e) => e.id === entry.state)
              return (
                <div key={entry.id} className="flex items-start gap-3 text-sm">
                  <span className={`px-2 py-0.5 rounded-full text-xs capitalize ${emotion?.color || 'bg-muted text-muted-foreground'}`}>{entry.state}</span>
                  <div className="flex-1">
                    <div className="flex gap-2 text-muted-foreground text-xs">
                      <span>{new Date(entry.timestamp).toLocaleTimeString()}</span>
                      <span>Intensity: {entry.intensity}/10</span>
                    </div>
                    {entry.notes && <p className="text-foreground/80 mt-1">{entry.notes}</p>}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
