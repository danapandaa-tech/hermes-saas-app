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
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/30">
          <HermesMark className="size-5 text-primary" />
        </div>
        <span className="hidden font-heading text-lg font-semibold tracking-tight text-sidebar-foreground lg:block">
          Hermes
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-2 py-4 lg:px-3">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = active === item.label
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => setActive(item.label)}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                "justify-center lg:justify-start",
                isActive
                  ? "bg-sidebar-accent text-sidebar-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
              )}
            >
              <Icon
                className={cn(
                  "size-5 shrink-0 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-sidebar-foreground",
                )}
              />
              <span className="hidden lg:block">{item.label}</span>
            </button>
          )
        })}
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
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
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

function HermesMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 2v20M5 6l14 12M19 6L5 18"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="2.4" fill="currentColor" />
    </svg>
  )
}
