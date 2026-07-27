"use client"

import {
  FolderKanban,
  Brain,
  Workflow,
  CheckCircle2,
  Loader2,
  Mail,
  Route,
  Share2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useProjectStore } from "@/lib/project-store"
import { useMemoryStore } from "@/lib/memory-store"
import { useAutomationStore } from "@/lib/automation-store"
import { useTaskStore } from "@/lib/task-store"
import { useAuth } from "@/lib/use-auth"

export function ContextPanel() {
  const { userId } = useAuth()
  const projects = useProjectStore((state) => state.projects)
  const selectedProjectId = useProjectStore((state) => state.selectedProjectId)
  const memories = useMemoryStore((state) => state.memories)
  const automations = useAutomationStore((state) => state.automations)
  const tasks = useTaskStore((state) => state.tasks)
  
  const activeProject = projects.find((p) => p.id === selectedProjectId && p.userId === userId && p.status === "active")
  const projectMemories = memories.filter((m) => m.userId === userId && m.projectId === activeProject?.id).slice(0, 3)
  const projectTasks = activeProject ? tasks.filter((t) => t.projectId === activeProject.id) : []
  const completedTasks = projectTasks.filter((t) => t.status === "completed").length
  const activeAutomations = automations.filter((a) => a.userId === userId && a.isActive).slice(0, 3)
  return (
    <aside className="hidden h-full w-80 shrink-0 overflow-y-auto border-l border-border bg-card/30 px-5 py-6 xl:block">
      {/* Project context */}
      {activeProject ? (
        <Section icon={FolderKanban} title="Project context">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-card-foreground truncate">{activeProject.name}</p>
              <span className="shrink-0 rounded-full bg-primary/15 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-primary">
                Active
              </span>
            </div>
            {activeProject.description && (
              <p className="mt-1 font-mono text-[11px] text-muted-foreground truncate">{activeProject.description}</p>
            )}
            <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${projectTasks.length > 0 ? (completedTasks / projectTasks.length) * 100 : 0}%` }}
              />
            </div>
            <p className="mt-2 font-mono text-[11px] text-muted-foreground">
              {completedTasks} of {projectTasks.length} tasks complete
            </p>
          </div>
        </Section>
      ) : (
        <Section icon={FolderKanban} title="Project context">
          <div className="rounded-lg border border-dashed border-border p-4 text-center">
            <p className="text-xs text-muted-foreground">No project selected. Create one to get started.</p>
          </div>
        </Section>
      )}

      {/* Memory snippets */}
      <Section icon={Brain} title="Memory snippets">
        {projectMemories.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {projectMemories.map((memory) => (
              <li
                key={memory.id}
                className="border-l-2 border-primary/25 bg-primary/5 pl-3 pr-2 py-2 text-xs leading-relaxed text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground cursor-default"
              >
                {memory.content.slice(0, 80)}{memory.content.length > 80 ? "..." : ""}
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-lg border border-dashed border-border p-4 text-center">
            <p className="text-xs text-muted-foreground">Save insights from chat to build your memory.</p>
          </div>
        )}
      </Section>

      {/* Active workflows */}
      <Section icon={Workflow} title="Active workflows">
        {activeAutomations.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {activeAutomations.map((wf) => (
              <li
                key={wf.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-card/60 px-3 py-2.5"
              >
                <div className="size-4 shrink-0 rounded-full bg-green-500/30 animate-pulse" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-card-foreground">{wf.name}</p>
                  <p className="truncate font-mono text-[11px] text-muted-foreground/80">
                    {wf.trigger} · {wf.action.replace("-", " ")}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-lg border border-dashed border-border p-4 text-center">
            <p className="text-xs text-muted-foreground">Create automations to run workflows.</p>
          </div>
        )}
      </Section>

      <Section icon={Workflow} title="Plan & integrations">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-card-foreground">Free plan</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Unlimited chat and capture. Up to 15 completed workflow runs each month.
              </p>
            </div>
            <span className="rounded-full border border-border bg-muted px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Free
            </span>
          </div>

          <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
            <PaidFeature icon={Mail} label="Email monitoring" />
            <PaidFeature icon={Route} label="Marketplace routing" />
            <PaidFeature icon={Share2} label="Buffer publishing" />
          </div>

          <button
            type="button"
            disabled
            title="Upgrade becomes available after account authentication is configured"
            className="mt-4 w-full cursor-not-allowed rounded-lg bg-primary/70 px-3 py-2 text-xs font-medium text-primary-foreground opacity-80"
          >
            Upgrade setup pending
          </button>
        </div>
      </Section>
    </aside>
  )
}

function PaidFeature({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
}) {
  return (
    <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
      <Icon className="size-3.5 text-primary/70" />
      <span className="min-w-0 flex-1 truncate">{label}</span>
      <span className="font-mono text-[9px] uppercase tracking-wider text-primary">
        Paid
      </span>
    </div>
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
        <Icon className="size-3.5 text-primary/70" />
        <h2 className="font-mono text-[10px] font-medium uppercase tracking-widest text-muted-foreground">{title}</h2>
      </div>
      {children}
    </section>
  )
}
