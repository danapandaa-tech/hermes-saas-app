"use client"

import { MessageSquare, Telescope, PenLine } from "lucide-react"
import { cn } from "@/lib/utils"

const modes = [
  { label: "Chat", icon: MessageSquare },
  { label: "Research", icon: Telescope },
  { label: "Write", icon: PenLine },
] as const

export type ChatMode = (typeof modes)[number]["label"]

export function ModeToggle({
  value,
  onChange,
}: {
  value: ChatMode
  onChange: (mode: ChatMode) => void
}) {
  return (
    <div
      role="tablist"
      aria-label="Workspace mode"
      className="inline-flex items-center gap-1 rounded-xl border border-border bg-card/60 p-1"
    >
      {modes.map((mode) => {
        const Icon = mode.icon
        const isActive = value === mode.label
        return (
          <button
            key={mode.label}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(mode.label)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
            <span className="hidden sm:block">{mode.label}</span>
          </button>
        )
      })}
    </div>
  )
}
