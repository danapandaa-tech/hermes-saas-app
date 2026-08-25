'use client'

import { useState } from 'react'
import { Check, X, ExternalLink, Key, Zap, Globe, Brain } from 'lucide-react'

type Integration = {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  category: 'ai' | 'productivity' | 'communication' | 'storage'
  connected: boolean
  apiKey?: string
  settings?: Record<string, string>
}

const defaultIntegrations: Integration[] = [
  { id: 'openai', name: 'OpenAI', description: 'GPT-4, GPT-3.5 for advanced reasoning', icon: Brain, category: 'ai', connected: false },
  { id: 'zapier', name: 'Zapier', description: 'Automate workflows across 5000+ apps', icon: Zap, category: 'productivity', connected: false },
  { id: 'notion', name: 'Notion', description: 'Sync notes, docs, and databases', icon: Globe, category: 'storage', connected: false },
]

export function IntegrationsView() {
  const [integrations, setIntegrations] = useState<Integration[]>(defaultIntegrations)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [apiKeyInput, setApiKeyInput] = useState('')

  const handleConnect = (id: string) => {
    setIntegrations((prev) =>
      prev.map((i) => (i.id === id ? { ...i, connected: true, apiKey: apiKeyInput || 'demo-key' } : i))
    )
    setEditingId(null)
    setApiKeyInput('')
  }

  const handleDisconnect = (id: string) => {
    setIntegrations((prev) =>
      prev.map((i) => (i.id === id ? { ...i, connected: false, apiKey: undefined } : i))
    )
  }

  const connectedCount = integrations.filter((i) => i.connected).length

  return (
    <div className="flex h-full flex-col gap-6 px-4 py-6 sm:px-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-medium tracking-tight text-foreground">Integrations</h1>
          <p className="text-sm text-muted-foreground">Connect your tools and services</p>
        </div>
        <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs">
          <span className="font-medium text-foreground">{connectedCount}</span>
          <span className="text-muted-foreground"> connected</span>
        </div>
      </div>

      <div className="space-y-3">
        {integrations.map((integration) => {
          const Icon = integration.icon
          const isEditing = editingId === integration.id
          return (
            <div
              key={integration.id}
              className="rounded-lg border border-border bg-card p-4 transition-colors hover:border-border/80"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{integration.name}</p>
                      {integration.connected && (
                        <span className="flex items-center gap-1 rounded-full bg-green-500/15 px-2 py-0.5 text-xs font-medium text-green-600">
                          <Check className="size-3" />
                          Connected
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{integration.description}</p>
                  </div>
                </div>
                <div className="shrink-0">
                  {integration.connected ? (
                    <button
                      onClick={() => handleDisconnect(integration.id)}
                      className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                    >
                      <X className="size-3.5" />
                      Disconnect
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditingId(integration.id)}
                      className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      <Key className="size-3.5" />
                      Connect
                    </button>
                  )}
                </div>
              </div>

              {isEditing && !integration.connected && (
                <div className="mt-4 border-t border-border pt-4">
                  <label className="block text-xs font-medium text-muted-foreground mb-2">
                    API Key (optional for demo)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                      placeholder="sk-..."
                      className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      onClick={() => handleConnect(integration.id)}
                      className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => { setEditingId(null); setApiKeyInput('') }}
                      className="rounded-lg border border-border px-4 py-2 text-xs font-medium hover:bg-muted"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-auto rounded-lg border border-dashed border-border p-4 text-center">
        <p className="text-xs text-muted-foreground">
          More integrations coming soon.{' '}
          <a href="#" className="text-primary hover:underline">Request an integration</a>
        </p>
      </div>
    </div>
  )
}
