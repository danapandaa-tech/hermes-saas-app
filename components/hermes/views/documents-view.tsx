'use client'

export function DocumentsView() {
  return (
    <div className="flex h-full flex-col gap-6 px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-3">
        <h1 className="font-heading text-2xl font-medium tracking-tight text-foreground">Documents</h1>
        <p className="text-sm text-muted-foreground">Upload, organize, and collaborate on documents</p>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border border-border bg-card/50 p-4">
          <h3 className="font-medium text-foreground">Upload Document</h3>
          <p className="mt-2 text-sm text-muted-foreground">Add PDFs, images, and other files to your workspace.</p>
        </div>

        <div className="rounded-lg border border-border bg-card/50 p-4">
          <h3 className="font-medium text-foreground">Recent Files</h3>
          <p className="mt-2 text-sm text-muted-foreground">Access your most recently used documents.</p>
        </div>

        <div className="rounded-lg border border-border bg-card/50 p-4">
          <h3 className="font-medium text-foreground">Shared with Me</h3>
          <p className="mt-2 text-sm text-muted-foreground">Documents shared by your team members.</p>
        </div>
      </div>
    </div>
  )
}
