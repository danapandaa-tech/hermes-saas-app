'use client'

export function ResearchView() {
  return (
    <div className="flex h-full flex-col gap-6 px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-3">
        <h1 className="font-heading text-2xl font-medium tracking-tight text-foreground">Research</h1>
        <p className="text-sm text-muted-foreground">Explore project context, docs, and insights</p>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border border-border bg-card/50 p-4">
          <h3 className="font-medium text-foreground">Research Library</h3>
          <p className="mt-2 text-sm text-muted-foreground">Browse your project documentation, research notes, and saved articles.</p>
        </div>

        <div className="rounded-lg border border-border bg-card/50 p-4">
          <h3 className="font-medium text-foreground">Web Search</h3>
          <p className="mt-2 text-sm text-muted-foreground">Search the web directly within Hermes and save findings to your vault.</p>
        </div>

        <div className="rounded-lg border border-border bg-card/50 p-4">
          <h3 className="font-medium text-foreground">Knowledge Graph</h3>
          <p className="mt-2 text-sm text-muted-foreground">See connections between your projects, people, and ideas at a glance.</p>
        </div>
      </div>
    </div>
  )
}
