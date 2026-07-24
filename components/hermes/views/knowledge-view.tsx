'use client'

export function KnowledgeView() {
  return (
    <div className="flex h-full flex-col gap-6 px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-3">
        <h1 className="font-heading text-2xl font-medium tracking-tight text-foreground">Knowledge Base</h1>
        <p className="text-sm text-muted-foreground">Centralized team knowledge and documentation</p>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border border-border bg-card/50 p-4">
          <h3 className="font-medium text-foreground">Pages</h3>
          <p className="mt-2 text-sm text-muted-foreground">Create and organize knowledge pages for your team.</p>
        </div>

        <div className="rounded-lg border border-border bg-card/50 p-4">
          <h3 className="font-medium text-foreground">Vault</h3>
          <p className="mt-2 text-sm text-muted-foreground">All your saved research, insights, and resources in one place.</p>
        </div>

        <div className="rounded-lg border border-border bg-card/50 p-4">
          <h3 className="font-medium text-foreground">Search</h3>
          <p className="mt-2 text-sm text-muted-foreground">Find anything across your knowledge base instantly.</p>
        </div>
      </div>
    </div>
  )
}
