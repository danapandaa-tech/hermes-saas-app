'use client'

import { useState } from 'react'
import { useCognitive } from './use-cognitive'
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'

const QUESTIONS = [
  // D1 - Cognitive Intensity (8 questions)
  { dim: 'CI', text: 'I can spend hours absorbed in a single topic without noticing time passing.' },
  { dim: 'CI', text: 'I often see connections between things that seem unrelated to others.' },
  { dim: 'CI', text: 'My mind races with ideas faster than I can express them.' },
  { dim: 'CI', text: 'I prefer deep, complex topics over simple, straightforward ones.' },
  { dim: 'CI', text: 'I find myself questioning things that others accept without thought.' },
  { dim: 'CI', text: 'I can engage in intense intellectual debates that last for hours.' },
  { dim: 'CI', text: 'I often have multiple layers of thought happening simultaneously.' },
  { dim: 'CI', text: 'I become frustrated when I cannot fully understand something.' },

  // D2 - Emotional Resonance (8 questions)
  { dim: 'ER', text: "I feel others' emotions as if they were my own." },
  { dim: 'ER', text: 'I have experienced grief so intense it felt physical.' },
  { dim: 'ER', text: 'I can be moved to tears by music, art, or stories.' },
  { dim: 'ER', text: 'I sometimes feel overwhelmed by the suffering in the world.' },
  { dim: 'ER', text: 'My emotional responses are often stronger than others expect.' },
  { dim: 'ER', text: 'I form deep attachments to people, places, and even objects.' },
  { dim: 'ER', text: 'I experience joy and beauty very intensely.' },
  { dim: 'ER', text: "I am deeply affected by injustice, even when it doesn't directly impact me." },

  // D3 - Sensory Amplification (8 questions)
  { dim: 'SA', text: 'Certain textures, sounds, or smells can overwhelm me.' },
  { dim: 'SA', text: 'I am deeply affected by my physical environment.' },
  { dim: 'SA', text: 'I notice sensory details that others seem to miss.' },
  { dim: 'SA', text: 'I have strong preferences about food, clothing, or aesthetics.' },
  { dim: 'SA', text: 'Bright lights, loud noises, or strong smells can be painful.' },
  { dim: 'SA', text: 'I need time to adjust when my environment changes significantly.' },
  { dim: 'SA', text: 'I am sensitive to how things taste, feel, or sound.' },
  { dim: 'SA', text: 'I can become distressed by sensory chaos like crowds or markets.' },

  // D4 - Creative Divergence (8 questions)
  { dim: 'CD', text: 'I often think in metaphors and images rather than words.' },
  { dim: 'CD', text: 'I come up with ideas that others find strange or unusual.' },
  { dim: 'CD', text: 'I see multiple possible solutions to every problem.' },
  { dim: 'CD', text: 'I sometimes struggle to explain my thinking process to others.' },
  { dim: 'CD', text: 'I prefer to find my own way rather than follow instructions.' },
  { dim: 'CD', text: 'My creativity often leads me in unexpected directions.' },
  { dim: 'CD', text: 'I enjoy experimenting and taking unconventional approaches.' },
  { dim: 'CD', text: 'I blend different ideas or fields in ways that surprise people.' },

  // D5 - Existential Drive (8 questions)
  { dim: 'ED', text: 'I often think about the meaning and purpose of life.' },
  { dim: 'ED', text: 'I feel a strong need to understand myself at a deep level.' },
  { dim: 'ED', text: "I sometimes feel like I don't fit into the world around me." },
  { dim: 'ED', text: 'I have experienced periods of intense inner transformation.' },
  { dim: 'ED', text: 'I feel things deeply.' },
  { dim: 'ED', text: 'I am driven by a search for authenticity and truth.' },
  { dim: 'ED', text: 'I question who I am and who I want to become.' },
  { dim: 'ED', text: 'I believe my life should have a larger purpose or meaning.' },
]

const DIMENSIONS: Record<string, { name: string; icon: string; color: string }> = {
  CI: { name: 'Cognitive Intensity', icon: '▲', color: 'text-indigo-500' },
  ER: { name: 'Emotional Resonance', icon: '●', color: 'text-rose-500' },
  SA: { name: 'Sensory Amplification', icon: '✱', color: 'text-amber-500' },
  CD: { name: 'Creative Divergence', icon: '◆', color: 'text-violet-500' },
  ED: { name: 'Existential Drive', icon: '◉', color: 'text-blue-500' },
}

const LIKERT_LABELS = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']

export function MindSpark() {
  const store = useCognitive()
  const spark = store.getSparkTranslation()
  const [responses, setResponses] = useState(Array(40).fill(null))
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [step, setStep] = useState<'assess' | 'results'>(spark ? 'results' : 'assess')

  const handleResponse = (value: number) => {
    const newResponses = [...responses]
    newResponses[currentQuestion] = value
    setResponses(newResponses)
    if (currentQuestion < 39) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 200)
    }
  }

  const handleSubmit = () => {
    const dimScores: Record<string, number[]> = {}
    QUESTIONS.forEach((q, idx) => {
      if (!dimScores[q.dim]) dimScores[q.dim] = []
      dimScores[q.dim].push(responses[idx] || 0)
    })

    const results: { CI: number; ER: number; SA: number; CD: number; ED: number } = { CI: 0, ER: 0, SA: 0, CD: 0, ED: 0 }
    let totalScore = 0
    Object.keys(dimScores).forEach((dim) => {
      const avg = dimScores[dim].reduce((a, b) => a + b, 0) / dimScores[dim].length
      results[dim as keyof typeof results] = avg
      totalScore += avg
    })

    const sparkIndex = totalScore
    let profileType = 'The Quiet Spark'
    if (sparkIndex >= 17) profileType = 'The Wildfire'
    else if (sparkIndex >= 13) profileType = 'The Burning Spark'
    else if (sparkIndex >= 7) profileType = 'The Flickering Spark'

    store.saveSparkResults({ results, sparkIndex, profileType })
    setStep('results')
  }

  const isComplete = responses.every((r) => r !== null)
  const progress = Math.round((responses.filter((r) => r !== null).length / 40) * 100)
  const q = QUESTIONS[currentQuestion]
  const dim = DIMENSIONS[q.dim]

  // ─── Results View ────────────────────────────────────────────────────────
  if (step === 'results' && spark) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-heading text-xl font-medium tracking-tight text-foreground">SPARK Results</h2>
          <p className="text-sm text-muted-foreground">Your cognitive profile translation</p>
        </div>

        <section className="rounded-lg border border-border bg-card p-4 border-t-4 border-t-primary">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Profile Type</p>
              <p className="text-lg font-semibold text-foreground">{spark.profileType}</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-foreground">{spark.sparkIndex.toFixed(1)}</div>
              <div className="text-xs text-muted-foreground">SPARK Index / 20</div>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          {spark.dimensions.map((d) => (
            <div key={d.key} className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-foreground">{d.name}</p>
                  <p className="text-xs text-muted-foreground">{d.band === 'quiet' ? 'Quiet' : d.band === 'present' ? 'Present' : 'Strong'}</p>
                </div>
                <div className="text-sm font-medium text-foreground">{d.score}/4</div>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-3">
                <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${(d.score / 4) * 100}%` }} />
              </div>
              {d.band !== 'quiet' && (
                <>
                  <p className="text-sm text-foreground/80 mb-1">{'✨'} {d.strength}</p>
                  <p className="text-sm text-primary/70">{'→'} {d.guidance}</p>
                </>
              )}
            </div>
          ))}
        </section>

        <button onClick={() => { setResponses(Array(40).fill(null)); setCurrentQuestion(0); setStep('assess') }} className="w-full flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">
          <RotateCcw className="size-4" />
          Retake Assessment
        </button>
      </div>
    )
  }

  // ─── Assessment View (40 questions) ──────────────────────────────────────
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-medium tracking-tight text-foreground">2E SPARK Assessment</h2>
        <p className="text-sm text-muted-foreground">Understanding your cognitive intensity</p>
      </div>

      {/* Progress bar */}
      <div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-gradient-to-r from-primary to-violet-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <p className="text-xs text-muted-foreground">{progress}% complete</p>
          <p className="text-xs text-muted-foreground">Question {currentQuestion + 1} of 40</p>
        </div>
      </div>

      {/* Question card */}
      <div className="rounded-lg border border-border bg-card p-5 border-l-4 border-l-primary">
        <div className="flex items-center gap-2 mb-4">
          <span className={`text-xl ${dim.color}`}>{dim.icon}</span>
          <span className="text-sm font-medium text-primary">{dim.name}</span>
        </div>

        <h3 className="text-base font-medium text-foreground mb-6">{q.text}</h3>

        {/* Likert scale */}
        <div className="grid grid-cols-5 gap-2 mb-3">
          {[0, 1, 2, 3, 4].map((value) => (
            <button
              key={value}
              onClick={() => handleResponse(value)}
              className={`py-3 px-2 rounded-lg font-medium text-sm transition-all ${
                responses[currentQuestion] === value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {value}
            </button>
          ))}
        </div>

        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Strongly Disagree</span>
          <span>Strongly Agree</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="size-4" />
          Back
        </button>

        <div className="text-xs text-muted-foreground">
          {responses.filter((r) => r !== null).length} of 40 answered
        </div>

        {currentQuestion < 39 ? (
          <button
            onClick={() => setCurrentQuestion(currentQuestion + 1)}
            disabled={responses[currentQuestion] === null}
            className="flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="size-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!isComplete}
            className="flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            See Results
          </button>
        )}
      </div>

      {/* Question progress dots */}
      <div className="rounded-lg bg-muted/30 p-3">
        <div className="flex gap-1 flex-wrap">
          {QUESTIONS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentQuestion(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                idx === currentQuestion
                  ? 'ring-2 ring-primary ring-offset-1 ring-offset-background'
                  : responses[idx] !== null
                    ? 'bg-primary'
                    : 'bg-muted'
              }`}
              title={`Question ${idx + 1}: ${QUESTIONS[idx].dim}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
