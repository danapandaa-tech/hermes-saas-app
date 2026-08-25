'use client'

import { useState } from 'react'
import { Lightbulb, Link2, Sparkles, HelpCircle, Rocket } from 'lucide-react'
import { useCognitive } from './use-cognitive'

const DISCOVERY_TYPES = [
  { id: 'insight', label: 'Insight', icon: Lightbulb, desc: 'A new understanding' },
  { id: 'pattern', label: 'Pattern', icon: Link2, desc: 'Something recurring' },
  { id: 'realization', label: 'Realization', icon: Sparkles, desc: 'Something clicked' },
  { id: 'question', label: 'Question', icon: HelpCircle, desc: 'Something to explore' },
  { id: 'breakthrough', label: 'Breakthrough', icon: Rocket, desc: 'Major shift' },
]

export function MindDiscoveries() {
  const store = useCognitive()
  const discoveries = store.discoveries
  const [type, setType] = useState('insight')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')

  const handleAdd = () => {
    if (!content.trim()) return
    store.addDiscovery({
      type,
      title: content.slice(0, 50),
      content: content.trim(),
      tags: tags.split(',').map((t: string) => t.trim()).filter(Boolean),
    })
    setContent('')
    setTags('')
  }

  const sorted = [...discoveries].reverse()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-medium tracking-tight text-foreground">Discoveries</h2>
        <p className="text-sm text-muted-foreground">Capture insights, patterns, and realizations</p>
      </div>

      {/* Input */}
      <section className="rounded-lg border border-border bg-card p-4 space-y-4">
        <h3 className="text-sm font-medium text-foreground">New Discovery</h3>
        
        <div className="flex flex-wrap gap-2">
          {DISCOVERY_TYPES.map((t) => {
            const Icon = t.icon
            return (
              <button
                key={t.id}
                onClick={() => setType(t.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  type === t.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="size-3.5" />
                {t.label}
              </button>
            )
          })}
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What did you discover?"
          className="w-full h-24 resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <div className="flex gap-2">
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (comma separated)"
            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button onClick={handleAdd} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Capture
          </button>
        </div>
      </section>

      {/* List */}
      {sorted.length > 0 && (
        <section className="rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm font-medium text-foreground mb-3">Your Discoveries ({sorted.length})</h3>
          <div className="space-y-3">
            {sorted.map((d) => {
              const typeInfo = DISCOVERY_TYPES.find((t) => t.id === (d as any).type)
              const Icon = typeInfo?.icon || Lightbulb
              return (
                <div key={d.id} className="border-b border-border pb-3 last:border-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="size-4 text-primary" />
                    <span className="text-xs text-muted-foreground">
                      {new Date(d.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{d.content}</p>
                  {(d.tags?.length ?? 0) > 0 && (
                    <div className="flex gap-1 mt-2">
                      {d.tags?.map((tag: string) => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
