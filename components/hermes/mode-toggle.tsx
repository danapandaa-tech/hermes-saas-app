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
      className="inline-flex items-center gap-0"
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
              "relative flex items-center gap-2 px-3.5 py-2 text-sm font-medium transition-colors",
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className={cn("size-4", isActive ? "text-accent" : "")} />
            <span className="hidden sm:block">{mode.label}</span>
            {/* Underline indicator */}
            {isActive && (
              <span
                className="absolute bottom-0 left-3.5 right-3.5 h-px bg-accent"
                aria-hidden="true"
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
