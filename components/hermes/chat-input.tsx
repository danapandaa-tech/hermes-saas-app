"use client"

import { useState } from "react"
import { Paperclip, ArrowUp, Sparkles, ListChecks, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import { useChatStore } from "@/lib/store"

const quickActions = [
  { label: "Summarize project", icon: Sparkles },
  { label: "Create tasks", icon: ListChecks },
  { label: "Draft a note", icon: FileText },
]

export function ChatInput() {
  const [value, setValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messages = useChatStore((state) => state.messages)
  const addMessage = useChatStore((state) => state.addMessage)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!value.trim() || isLoading) return

    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: value.trim(),
    }

    addMessage(userMessage)
    setValue("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role === "user" ? "user" : "assistant",
            content: m.content,
          })),
        }),
      })

      if (!response.body) throw new Error("No response body")

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ""
      const assistantId = Date.now().toString()
      let messageAdded = false

      while (true) {
        const { done, value: chunk } = await reader.read()
        if (done) break

        const text = decoder.decode(chunk)
        const lines = text.split("\n")

        for (const line of lines) {
          if (line.startsWith("0:")) {
            const content = line.slice(2)
            assistantMessage += content

            if (!messageAdded) {
              addMessage({
                id: assistantId,
                role: "assistant",
                content: assistantMessage,
              })
              messageAdded = true
            } else {
              const allMessages = useChatStore.getState().messages
              const idx = allMessages.findIndex((m) => m.id === assistantId)
              if (idx !== -1) {
                allMessages[idx].content = assistantMessage
                useChatStore.getState().setMessages([...allMessages])
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-6 sm:px-6">
      <div className="mb-3 flex flex-wrap gap-2.5">
        {quickActions.map((action) => {
          const Icon = action.icon
          return (
            <button
              key={action.label}
              type="button"
              onClick={() => setValue((v) => (v ? v : action.label))}
              className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/8 pl-3 pr-4 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-primary/50 hover:bg-primary/15 hover:text-foreground"
            >
              <Icon className="size-3 text-primary" />
              {action.label}
            </button>
          )
        })}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex items-end gap-2 rounded-2xl border border-border bg-card/80 p-2 shadow-lg backdrop-blur transition-all focus-within:border-primary/60 focus-within:shadow-primary/10 focus-within:shadow-xl"
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
          disabled={!value.trim() || isLoading}
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-xl transition-colors",
            value.trim() && !isLoading
              ? "bg-primary text-white shadow-md shadow-primary/30 hover:bg-primary/90"
              : "bg-muted text-muted-foreground",
          )}
        >
          <ArrowUp className="size-5" />
          <span className="sr-only">Send message</span>
        </button>
      </form>
      <p className="mt-2 text-center font-mono text-[11px] text-muted-foreground/60">
        Hermes runs quietly in the background.
      </p>
    </div>
  )
}
