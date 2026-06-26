"use client"

import { useState } from "react"
import { Paperclip, ArrowUp, Sparkles, ListChecks, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

const quickActions = [
  { label: "Summarize project", icon: Sparkles },
  { label: "Create tasks", icon: ListChecks },
  { label: "Draft a note", icon: FileText },
]

export function ChatInput() {
  const [value, setValue] = useState("")

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-6 sm:px-6">
      <div className="mb-3 flex flex-wrap gap-2">
        {quickActions.map((action) => {
          const Icon = action.icon
          return (
            <button
              key={action.label}
              type="button"
              onClick={() => setValue((v) => (v ? v : action.label))}
              className="flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              <Icon className="size-3.5 text-primary" />
              {action.label}
            </button>
          )
        })}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          setValue("")
        }}
        className="flex items-end gap-2 rounded-2xl border border-border bg-card/80 p-2 shadow-lg backdrop-blur transition-colors focus-within:border-primary/50"
      >
        <label className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
          <Paperclip className="size-5" />
          <span className="sr-only">Attach a file</span>
          <input type="file" className="sr-only" />
        </label>

        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={1}
          placeholder="Message Hermes…"
          className="max-h-40 min-h-9 flex-1 resize-none bg-transparent py-1.5 text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground"
        />

        <button
          type="submit"
          disabled={!value.trim()}
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors",
            value.trim()
              ? "bg-primary text-primary-foreground hover:opacity-90"
              : "bg-secondary text-muted-foreground",
          )}
        >
          <ArrowUp className="size-5" />
          <span className="sr-only">Send message</span>
        </button>
      </form>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        Hermes can run automations in the background while you chat.
      </p>
    </div>
  )
}
