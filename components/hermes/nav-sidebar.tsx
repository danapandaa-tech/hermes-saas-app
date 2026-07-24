"use client"

import { useState } from "react"
import {
  MessageSquare,
  FolderKanban,
  BookOpen,
  Workflow,
  Telescope,
  FileText,
  Plug,
  Settings,
  ChevronsUpDown,
  Check,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Chat", icon: MessageSquare },
  { label: "Projects", icon: FolderKanban },
  { label: "Knowledge", icon: BookOpen },
  { label: "Automations", icon: Workflow },
  { label: "Research", icon: Telescope },
  { label: "Documents", icon: FileText },
  { label: "Integrations", icon: Plug },
  { label: "Settings", icon: Settings },
]

const workspaces = ["Solo Studio", "Client Work", "Personal"]

export function NavSidebar() {
  const [active, setActive] = useState("Chat")
  const [switcherOpen, setSwitcherOpen] = useState(false)
  const [workspace, setWorkspace] = useState(workspaces[0])

  return (
    <aside className="flex h-full w-16 flex-col border-r border-sidebar-border bg-sidebar lg:w-64">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-3 lg:px-5">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/20 ring-1 ring-primary/35">
          <HermesMark className="size-5 text-primary" />
        </div>
        <span className="hidden font-heading text-xl font-medium tracking-wide text-sidebar-foreground lg:block">
          Hermes
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col overflow-y-auto px-2 py-4 lg:px-3">
        {/* Primary section label — mono eyebrow */}
        <p className="mb-1.5 hidden px-3 font-mono text-[10px] font-medium uppercase tracking-widest text-muted-foreground/50 lg:block">
          Workspace
        </p>
        {navItems.slice(0, 5).map((item) => (
          <NavItem key={item.label} item={item} isActive={active === item.label} onClick={() => setActive(item.label)} />
        ))}
        {/* Divider before utility items */}
        <div className="my-3 mx-3 hidden border-t border-sidebar-border lg:block" />
        <p className="mb-1.5 hidden px-3 font-mono text-[10px] font-medium uppercase tracking-widest text-muted-foreground/50 lg:block">
          Library
        </p>
        {navItems.slice(5).map((item) => (
          <NavItem key={item.label} item={item} isActive={active === item.label} onClick={() => setActive(item.label)} />
        ))}
      </nav>

      {/* Workspace switcher + avatar */}
      <div className="relative border-t border-sidebar-border p-2 lg:p-3">
        {switcherOpen && (
          <div className="absolute bottom-full left-2 right-2 mb-2 overflow-hidden rounded-xl border border-sidebar-border bg-popover p-1 shadow-xl lg:left-3 lg:right-3">
            {workspaces.map((ws) => (
              <button
                key={ws}
                type="button"
                onClick={() => {
                  setWorkspace(ws)
                  setSwitcherOpen(false)
                }}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-popover-foreground hover:bg-sidebar-accent"
              >
                {ws}
                {workspace === ws && <Check className="size-4 text-primary" />}
              </button>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={() => setSwitcherOpen((o) => !o)}
          className="flex w-full items-center gap-3 rounded-xl p-1.5 text-left transition-colors hover:bg-sidebar-accent/60"
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full hermes-avatar-user text-sm font-semibold">
            AM
          </div>
          <div className="hidden min-w-0 flex-1 lg:block">
            <p className="truncate text-sm font-medium text-sidebar-foreground">Ada Maro</p>
            <p className="truncate text-xs text-muted-foreground">{workspace}</p>
          </div>
          <ChevronsUpDown className="hidden size-4 shrink-0 text-muted-foreground lg:block" />
        </button>
      </div>
    </aside>
  )
}

function NavItem({
  item,
  isActive,
  onClick,
}: {
  item: { label: string; icon: React.ComponentType<{ className?: string }> }
  isActive: boolean
  onClick: () => void
}) {
  const Icon = item.icon
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        "justify-center lg:justify-start",
        isActive
          ? "bg-sidebar-accent text-sidebar-foreground"
          : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
      )}
    >
      <Icon
        className={cn(
          "size-4 shrink-0 transition-colors",
          isActive ? "text-primary" : "text-muted-foreground group-hover:text-sidebar-foreground",
        )}
      />
      <span className="hidden lg:block">{item.label}</span>
    </button>
  )
}

function HermesMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      {/* Caduceus: central staff */}
      <line x1="12" y1="3" x2="12" y2="21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Top wings — horizontal bar */}
      <path d="M8.5 5.5 Q12 3.5 15.5 5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none" />
      {/* Serpent left */}
      <path d="M12 7 Q8 9 10 12 Q7 15 12 17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      {/* Serpent right */}
      <path d="M12 7 Q16 9 14 12 Q17 15 12 17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      {/* Knot circle at center */}
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  )
}
