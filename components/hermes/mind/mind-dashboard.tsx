'use client'

import { useCognitive } from './use-cognitive'
import { STATES, ENERGY_LEVELS, SENSORY_LEVELS } from '@/lib/cognitive/stateMachine'

const STATE_COLORS: Record<string, string> = {
  flow: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  focused: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  scattered: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  overwhelmed: 'bg-red-500/15 text-red-400 border-red-500/30',
  recovering: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  dormant: 'bg-muted text-muted-foreground border-border',
  hyperfocus: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  dissociated: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
}

const ENERGY_ICONS: Record<string, string> = { high: '\u26A1', medium: '\u25C8', low: '\u25C7', depleted: '\u25CB' }

export function MindDashboard() {
  const store = useCognitive()
  const { cognitiveState: state, profile } = store
  const map = store.getCognitiveMap()
  const patterns = store.getPatterns()
  const recommendations = store.getRecommendations()
  const spark = store.getSparkTranslation()

  return (
    <div className="space-y-6">
      {/* SPARK Profile Summary */}
      {spark ? (
        <section className="rounded-lg border border-border bg-card p-4 border-t-4 border-t-primary">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Your SPARK Profile</p>
              <p className="text-lg font-semibold text-foreground">{spark.profileType}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground">{spark.sparkIndex.toFixed(1)}</div>
              <div className="text-xs text-muted-foreground">Index / 20</div>
            </div>
          </div>
          {spark.topStrengths.length > 0 && (
            <ul className="space-y-1 mb-3">
              {spark.topStrengths.map((s, i) => (
                <li key={i} className="text-sm text-foreground/80 flex gap-2">
                  <span className="text-primary">{'\u25C6'}</span><span>{s}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : (
        <section className="rounded-lg border border-border bg-card p-4 border-t-4 border-t-primary/40">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">Your SPARK Profile</p>
          <p className="text-sm text-muted-foreground mb-3">
            Take the assessment to translate how your mind works into your strengths and the conditions you need.
          </p>
          <button onClick={() => store.setActiveModule('spark')} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            Take the SPARK Assessment
          </button>
        </section>
      )}

      {/* Current State */}
      <section>
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-3">Current State</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {Object.values(STATES).map((s) => (
            <button
              key={s}
              onClick={() => store.changeState(s)}
              className={`px-3 py-2 rounded-lg text-sm capitalize border transition-all ${
                state.current === s
                  ? (STATE_COLORS[s] || '') + ' ring-1 ring-primary/50'
                  : 'bg-muted/50 text-muted-foreground border-border hover:border-primary/30'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </section>

      {/* Energy & Sensory */}
      <section className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Energy</p>
          <div className="flex gap-2">
            {Object.values(ENERGY_LEVELS).map((level) => (
              <button
                key={level}
                onClick={() => store.updateEnergy(level)}
                className={`flex-1 py-2 rounded-lg text-xs capitalize transition-all ${
                  state.energy === level
                    ? 'bg-primary/15 text-primary border border-primary/30'
                    : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                }`}
              >
                {ENERGY_ICONS[level]} {level}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Sensory Load</p>
          <div className="flex gap-2">
            {Object.values(SENSORY_LEVELS).map((level) => (
              <button
                key={level}
                onClick={() => store.updateSensory(level)}
                className={`flex-1 py-2 rounded-lg text-xs capitalize transition-all ${
                  state.sensory === level
                    ? 'bg-primary/15 text-primary border border-primary/30'
                    : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Cognitive Map Summary */}
      {!map.isEmpty && (
        <section className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Cognitive Map</p>
          <div className="text-sm text-foreground/80 space-y-1">
            <p>{map.totalEntries} state transitions tracked</p>
            {map.insights.map((insight, i) => (
              <p key={i} className="text-primary/80">{'\u2022'} {insight}</p>
            ))}
          </div>
        </section>
      )}

      {/* Pattern Warnings */}
      {patterns.warnings.length > 0 && (
        <section className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-amber-400 mb-2">{'\u26A0'} Patterns</p>
          <div className="space-y-2">
            {patterns.warnings.map((w, i) => (
              <p key={i} className="text-sm text-amber-300/80">{w}</p>
            ))}
          </div>
        </section>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <section className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Guidance</p>
          <ul className="space-y-1">
            {recommendations.map((r, i) => (
              <li key={i} className="text-sm text-foreground/80">{'\u2192'} {r}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Profile Summary */}
      <section className="rounded-lg border border-border bg-card p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Profile</p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-muted-foreground">Style:</span><span className="text-foreground ml-2 capitalize">{profile.cognitiveStyle}</span></div>
          <div><span className="text-muted-foreground">Attention:</span><span className="text-foreground ml-2 capitalize">{profile.attentionPattern?.replace(/_/g, ' ')}</span></div>
        </div>
      </section>
    </div>
  )
}
