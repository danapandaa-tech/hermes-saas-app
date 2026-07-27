"use client"

import { useState, useRef } from "react"
import { Paperclip, ArrowUp, Sparkles, ListChecks, FileText, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { useChat } from "@ai-sdk/react"
import { getHermesChat } from "@/lib/chat-instance"

const quickActions = [
  { label: "Summarize my current project status", icon: Sparkles },
  { label: "Help me create tasks for my project", icon: ListChecks },
  { label: "Draft a short progress note", icon: FileText },
  { label: "What should I focus on today?", icon: Zap },
]

export function ChatInput() {
  const [input, setInput] = useState("")
  const formRef = useRef<HTMLFormElement>(null)

  // AI SDK v7: useChat returns sendMessage, status, error — no input/handleSubmit
  const { sendMessage, status, error } = useChat({ chat: getHermesChat() })

  const isLoading = status === "streaming" || status === "submitted"

  const submit = () => {
    const text = input.trim()
    if (!text || isLoading) return
    setInput("")
    sendMessage({ text })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      submit()
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submit()
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-6 sm:px-6">
      {error && (
        <div className="mb-3 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          <div className="flex-1">{error.message}</div>
        </div>
      )}

      <div className="mb-3 flex flex-wrap gap-2.5">
        {quickActions.map((action) => {
          const Icon = action.icon
          return (
            <button
              key={action.label}
              type="button"
              onClick={() => setInput(action.label)}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/8 pl-3 pr-4 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-primary/50 hover:bg-primary/15 hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon className="size-3 text-primary" />
              {action.label}
            </button>
          )
        })}
      </div>

      <form
        ref={formRef}
        onSubmit={handleFormSubmit}
        className="flex items-end gap-2 rounded-2xl border border-border bg-card/80 p-2 shadow-lg backdrop-blur transition-all focus-within:border-primary/60 focus-within:shadow-primary/10 focus-within:shadow-xl"
      >
        <label className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
          <Paperclip className="size-5" />
          <span className="sr-only">Attach a file</span>
          <input type="file" className="sr-only" />
        </label>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Message Hermes…"
          className="max-h-40 min-h-9 flex-1 resize-none bg-transparent py-1.5 text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground"
        />

        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors",
            input.trim() && !isLoading
              ? "bg-primary text-white shadow-md shadow-primary/30 hover:bg-primary/90"
              : "bg-muted text-muted-foreground",
          )}
        >
          <ArrowUp className="size-5" />
          <span className="sr-only">Send message</span>
        </button>
      </form>
      <p className="mt-2 text-center font-mono text-[11px] text-muted-foreground/60">
        Press Enter to send · Shift+Enter for new line
      </p>
    </div>
  )
}
