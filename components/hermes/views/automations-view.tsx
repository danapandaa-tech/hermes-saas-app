'use client'

export function AutomationsView() {
  return (
    <div className="flex h-full flex-col gap-6 px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-3">
        <h1 className="font-heading text-2xl font-medium tracking-tight text-foreground">Automations</h1>
        <p className="text-sm text-muted-foreground">Create workflows and automate your team's processes</p>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border border-border bg-card/50 p-4">
          <h3 className="font-medium text-foreground">Active Workflows</h3>
          <p className="mt-2 text-sm text-muted-foreground">View and manage your active automations. Currently running: 0</p>
        </div>

        <div className="rounded-lg border border-border bg-card/50 p-4">
          <h3 className="font-medium text-foreground">Create Workflow</h3>
          <p className="mt-2 text-sm text-muted-foreground">Build a new automation to save time on repetitive tasks.</p>
        </div>

        <div className="rounded-lg border border-border bg-card/50 p-4">
          <h3 className="font-medium text-foreground">Templates</h3>
          <p className="mt-2 text-sm text-muted-foreground">Start from pre-built workflow templates for common tasks.</p>
        </div>
      </div>
    </div>
  )
}
