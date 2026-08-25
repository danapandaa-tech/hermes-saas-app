'use client'

import { useCognitive } from './use-cognitive'

export function MindPatterns() {
  const store = useCognitive()
  const patterns = store.getPatterns()
  const map = store.getCognitiveMap()
  const { profile } = store

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-medium tracking-tight text-foreground">Pattern Engine</h2>
        <p className="text-sm text-muted-foreground">Detected patterns from your cognitive data</p>
      </div>

      {patterns.isEmpty && (
        <section className="rounded-lg border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground text-sm">Not enough data yet. Use the system for a few days and patterns will emerge.</p>
        </section>
      )}

      {patterns.warnings.length > 0 && (
        <section className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-amber-400 mb-3">{'\u26A0'} Warnings</p>
          <div className="space-y-2">
            {patterns.warnings.map((w, i) => (
              <p key={i} className="text-sm text-amber-300/80">{w}</p>
            ))}
          </div>
        </section>
      )}

      {patterns.patterns.length > 0 && (
        <section className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">Detected Patterns</p>
          <div className="space-y-4">
            {patterns.patterns.map((p, i) => (
              <div key={i} className="border-b border-border pb-3 last:border-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary capitalize">{p.type.replace(/_/g, ' ')}</span>
                </div>
                <p className="text-sm text-foreground">{p.description}</p>
                {p.suggestion && <p className="text-sm text-primary/70 mt-1">{'\u2192'} {p.suggestion}</p>}
                {p.frequency && <p className="text-xs text-muted-foreground mt-1">Frequency: {p.frequency}</p>}
                {p.triggers && p.triggers.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {p.triggers.map((t) => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 capitalize">{t.replace(/_/g, ' ')}</span>
                    ))}
                  </div>
                )}
                {p.missing && p.missing.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground mb-1">Missing states:</p>
                    <div className="flex gap-1">
                      {p.missing.map((s) => (
                        <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 capitalize">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {!map.isEmpty && (
        <section className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">Cognitive Map Data</p>
          <div className="text-sm text-foreground/80 space-y-2">
            <p>{map.totalEntries} state transitions tracked</p>
            {Object.keys(map.stateFrequency).length > 0 && (
              <div>
                <p className="text-muted-foreground text-xs mb-1">State Frequency:</p>
                <div className="grid grid-cols-2 gap-1">
                  {Object.entries(map.stateFrequency).map(([state, count]) => (
                    <div key={state} className="flex justify-between text-xs">
                      <span className="capitalize text-foreground/60">{state}</span>
                      <span className="text-muted-foreground">{count}x</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {map.topTransitions.length > 0 && (
              <div>
                <p className="text-muted-foreground text-xs mb-1">Common Transitions:</p>
                {map.topTransitions.map((t, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span className="text-foreground/60">{t.chain}</span>
                    <span className="text-muted-foreground">{t.count}x</span>
                  </div>
                ))}
              </div>
            )}
            {map.insights.length > 0 && (
              <div>
                <p className="text-muted-foreground text-xs mb-1">Insights:</p>
                {map.insights.map((insight, i) => (
                  <p key={i} className="text-primary/80">{'\u2022'} {insight}</p>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <section className="rounded-lg border border-border bg-card p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">Profile Summary</p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-muted-foreground">Style:</span><span className="text-foreground ml-2 capitalize">{profile.cognitiveStyle}</span></div>
          <div><span className="text-muted-foreground">Attention:</span><span className="text-foreground ml-2 capitalize">{profile.attentionPattern?.replace(/_/g, ' ')}</span></div>
          <div><span className="text-muted-foreground">Strengths:</span><span className="text-foreground ml-2">{profile.strengths?.length || 0} recorded</span></div>
          <div><span className="text-muted-foreground">Challenges:</span><span className="text-foreground ml-2">{profile.challenges?.length || 0} recorded</span></div>
        </div>
      </section>
    </div>
  )
}
