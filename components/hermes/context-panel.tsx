import { FolderKanban, Brain, Workflow, CheckCircle2, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const memorySnippets = [
  "Client prefers warm, editorial tone over playful.",
  "Avoid purple in the logo — too close to a competitor.",
  "Friday progress notes should stay under 5 lines.",
]

const workflows = [
  { name: "Daily briefing", status: "running" as const, detail: "Next run Fri, 4:00 PM" },
  { name: "Client outreach", status: "done" as const, detail: "Sent 2 emails today" },
  { name: "Asset backup", status: "done" as const, detail: "Synced to Drive" },
]

export function ContextPanel() {
  return (
    <aside className="hidden h-full w-80 shrink-0 overflow-y-auto border-l border-border bg-card/30 px-5 py-6 xl:block">
      {/* Project context */}
      <Section icon={FolderKanban} title="Project context">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-card-foreground">Lumen Rebrand</p>
            <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-accent/80">
              Active
            </span>
          </div>
          <p className="mt-1 font-mono text-[11px] text-muted-foreground/70">Brand identity · Due in 9 days</p>
          <div className="mt-3 h-px w-full overflow-hidden bg-border">
            <div className="h-full w-2/5 bg-accent/60" />
          </div>
          <p className="mt-2 font-mono text-[11px] text-muted-foreground/70">3 of 8 tasks complete</p>
        </div>
      </Section>

      {/* Memory snippets */}
      <Section icon={Brain} title="Memory snippets">
        <ul className="flex flex-col gap-2">
          {memorySnippets.map((snippet) => (
            <li
              key={snippet}
              className="border-l-2 border-accent/20 bg-card/30 pl-3 pr-2 py-2 text-xs leading-relaxed text-muted-foreground hover:border-accent/50 hover:text-foreground/80 transition-colors cursor-default"
            >
              {snippet}
            </li>
          ))}
        </ul>
      </Section>

      {/* Active workflows */}
      <Section icon={Workflow} title="Active workflows">
        <ul className="flex flex-col gap-2">
          {workflows.map((wf) => (
            <li
              key={wf.name}
              className="flex items-center gap-3 rounded-lg border border-border bg-card/60 px-3 py-2.5"
            >
              {wf.status === "running" ? (
                <Loader2 className="size-4 shrink-0 animate-spin text-accent" />
              ) : (
                <CheckCircle2 className="size-4 shrink-0 text-accent" />
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-card-foreground">{wf.name}</p>
                <p className="truncate font-mono text-[11px] text-muted-foreground/80">{wf.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>
    </aside>
  )
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  children: React.ReactNode
}) {
  return (
    <section className={cn("mb-7")}>
      <div className="mb-3 flex items-center gap-2">
        <Icon className="size-3.5 text-accent/70" />
        <h2 className="font-mono text-[10px] font-medium uppercase tracking-widest text-muted-foreground">{title}</h2>
      </div>
      {children}
    </section>
  )
}
