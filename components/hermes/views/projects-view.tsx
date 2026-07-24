'use client'

export function ProjectsView() {
  return (
    <div className="flex h-full flex-col gap-6 px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-3">
        <h1 className="font-heading text-2xl font-medium tracking-tight text-foreground">Projects</h1>
        <p className="text-sm text-muted-foreground">Manage and organize your active projects</p>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border border-border bg-card/50 p-4">
          <h3 className="font-medium text-foreground">Lumen Rebrand</h3>
          <p className="mt-2 text-sm text-muted-foreground">Brand direction, creative assets, and team coordination</p>
        </div>

        <div className="rounded-lg border border-border bg-card/50 p-4">
          <h3 className="font-medium text-foreground">New Project</h3>
          <p className="mt-2 text-sm text-muted-foreground">Create a new project to collaborate with your team.</p>
        </div>

        <div className="rounded-lg border border-border bg-card/50 p-4">
          <h3 className="font-medium text-foreground">Archived</h3>
          <p className="mt-2 text-sm text-muted-foreground">View completed and archived projects.</p>
        </div>
      </div>
    </div>
  )
}
