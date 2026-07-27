'use client'

export function IntegrationsView() {
  return (
    <div className="flex h-full flex-col gap-6 px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-3">
        <h1 className="font-heading text-2xl font-medium tracking-tight text-foreground">Integrations</h1>
        <p className="text-sm text-muted-foreground">Connect your favorite tools and services</p>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border border-border bg-card/50 p-4">
          <h3 className="font-medium text-foreground">Connected Apps</h3>
          <p className="mt-2 text-sm text-muted-foreground">Manage your connected integrations and permissions.</p>
        </div>

        <div className="rounded-lg border border-border bg-card/50 p-4">
          <h3 className="font-medium text-foreground">Available Integrations</h3>
          <p className="mt-2 text-sm text-muted-foreground">Browse all available integrations to enhance Hermes.</p>
        </div>

        <div className="rounded-lg border border-border bg-card/50 p-4">
          <h3 className="font-medium text-foreground">API Keys</h3>
          <p className="mt-2 text-sm text-muted-foreground">Manage your API keys and webhooks securely.</p>
        </div>
      </div>
    </div>
  )
}
