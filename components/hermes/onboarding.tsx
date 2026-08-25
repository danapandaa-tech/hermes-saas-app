'use client'

import { useState } from 'react'
import { Brain, MessageSquare, BookOpen, Zap, ArrowRight, ArrowLeft } from 'lucide-react'
import { useViewStore } from '@/lib/view-store'

const steps = [
  {
    icon: MessageSquare,
    title: 'Welcome to Hermes',
    description: 'Your AI workspace for research, automation, and cognitive flow. Chat naturally, manage projects, and build your knowledge base.',
    action: 'Let\'s start',
  },
  {
    icon: Brain,
    title: 'Mind View',
    description: 'Track your cognitive states, emotions, and sensory experiences. Complete the SPARK assessment to understand your profile.',
    action: 'Explore Mind',
    view: 'mind' as const,
  },
  {
    icon: BookOpen,
    title: 'Knowledge Base',
    description: 'Save insights from chat, auto-detect patterns from your cognitive data, and visualize connections.',
    action: 'View Knowledge',
    view: 'knowledge' as const,
  },
  {
    icon: Zap,
    title: 'Automations',
    description: 'Create workflows that trigger based on schedules or events. Automate repetitive tasks and reminders.',
    action: 'Set up Automations',
    view: 'automations' as const,
  },
]

export function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0)
  const setActiveView = useViewStore((state) => state.setActiveView)
  const [dismissed, setDismissed] = useState(false)

  const step = steps[currentStep]
  const Icon = step.icon
  const isLastStep = currentStep === steps.length - 1

  const handleAction = () => {
    if (step.view) {
      setActiveView(step.view)
    }
    if (isLastStep) {
      setDismissed(true)
      localStorage.setItem('hermes-onboarding-dismissed', 'true')
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  if (dismissed || typeof window !== 'undefined' && localStorage.getItem('hermes-onboarding-dismissed') === 'true') {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 w-2 rounded-full transition-all ${
                idx === currentStep ? 'bg-primary w-6' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <Icon className="size-8" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">{step.title}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted disabled:opacity-50"
          >
            <ArrowLeft className="size-4" />
            Back
          </button>
          <button
            onClick={handleAction}
            className="flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            {step.action}
            {!isLastStep && <ArrowRight className="size-4" />}
          </button>
        </div>

        {/* Skip */}
        <button
          onClick={() => {
            setDismissed(true)
            localStorage.setItem('hermes-onboarding-dismissed', 'true')
          }}
          className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-foreground"
        >
          Skip onboarding
        </button>
      </div>
    </div>
  )
}
