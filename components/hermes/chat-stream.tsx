"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { useChatStore } from "@/lib/store"
import { useAuth } from "@/lib/use-auth"
import { useMemoryStore } from "@/lib/memory-store"
import { useProjectStore } from "@/lib/project-store"
import { useViewStore } from "@/lib/view-store"

function HermesMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <line x1="12" y1="3" x2="12" y2="21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8.5 5.5 Q12 3.5 15.5 5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none" />
      <path d="M12 7 Q8 9 10 12 Q7 15 12 17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M12 7 Q16 9 14 12 Q17 15 12 17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  )
}

export function ChatStream() {
  const messages = useChatStore((state: any) => state.messages)
  const isLoading = useChatStore((state: any) => state.isLoading)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6 overflow-y-auto">
      <div className="flex flex-col items-center gap-3 pb-6 text-center">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/15 ring-1 ring-primary/30">
          <HermesMark className="size-6 text-primary" />
        </div>
        <h1 className="font-heading text-balance text-2xl font-medium tracking-tight text-foreground">
          Hermes
        </h1>
        <p className="max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
          Your AI workspace for research, automation, and cognitive flow.
        </p>
        <div className="mt-2 h-px w-16 bg-primary/30" />
      </div>

      {messages.map((message: any) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {isLoading && (
        <div className="flex gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/25">
            <HermesMark className="size-4 text-primary" />
          </div>
          <div className="flex max-w-[80%] flex-col gap-2 py-3">
            <div className="space-y-2">
              <div className="h-3 w-48 animate-pulse rounded-full bg-muted" />
              <div className="h-3 w-40 animate-pulse rounded-full bg-muted" />
              <div className="h-3 w-44 animate-pulse rounded-full bg-muted" />
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} className="h-0 w-0" />
    </div>
  )
}

function MessageBubble({ message }: { message: { id: string; role: string; content: string } }) {
  const addMemory = useMemoryStore((state: any) => state.addMemory)
  const selectedProjectId = useProjectStore((state: any) => state.selectedProjectId)
  const setActiveView = useViewStore((state: any) => state.setActiveView)
  const { userId } = useAuth()
  const [saved, setSaved] = useState(false)
  
  const isUser = message.role === "user"
  
  const handleSaveToMemory = () => {
    if (!userId) {
      console.warn('Cannot save memory: user not authenticated')
      return
    }
    const memory = {
      id: `mem_${Date.now()}`,
      userId,
      projectId: selectedProjectId,
      type: isUser ? "decision" as const : ("insight" as const),
      title: message.content.slice(0, 50) + (message.content.length > 50 ? "..." : ""),
      content: message.content,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    addMemory(memory)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleViewKnowledge = () => {
    setActiveView('knowledge')
  }

  return (
    <div className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}>
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
          isUser ? "hermes-avatar-user" : "bg-primary/15 text-primary ring-1 ring-primary/25",
        )}
        aria-hidden="true"
      >
        {isUser ? <span className="font-medium">AM</span> : <HermesMark className="size-4 text-primary" />}
      </div>
      <div className={cn("group/msg flex max-w-[80%] flex-col gap-1", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-relaxed",
            isUser
              ? "hermes-bubble-user rounded-tr-sm shadow-md"
              : "hermes-bubble-hermes rounded-tl-sm shadow-md",
          )}
        >
          {message.content}
        </div>
        {!isUser && (
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={handleSaveToMemory}
              disabled={saved}
              className="text-muted-foreground opacity-60 transition-opacity group-hover/msg:opacity-100 hover:text-primary disabled:opacity-100 disabled:text-green-600"
              title="Save to Knowledge Base"
            >
              {saved ? "✓ Saved!" : "📌 Save"}
            </button>
            <span className="text-muted-foreground/40">•</span>
            <button
              onClick={handleViewKnowledge}
              className="text-muted-foreground opacity-60 transition-opacity group-hover/msg:opacity-100 hover:text-primary"
              title="View Knowledge Base"
            >
              Knowledge →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
