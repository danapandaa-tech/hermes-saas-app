"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { useChat } from "@ai-sdk/react"
import { getHermesChat } from "@/lib/chat-instance"
import { useMemoryStore } from "@/lib/memory-store"
import { useProjectStore } from "@/lib/project-store"

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
  const { messages, status } = useChat({ chat: getHermesChat() })
  const isLoading = status === "streaming" || status === "submitted"
  // status values in AI SDK v7: 'ready' | 'submitted' | 'streaming' | 'error'
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
          Good to see you
        </h1>
        <p className="max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
          A calm space to think. Hermes carries your context, tasks, and workflows so you don&apos;t have to.
        </p>
        <div className="mt-2 h-px w-16 bg-primary/30" />
      </div>

      {messages.length === 0 && (
        <p className="text-center text-sm text-muted-foreground">
          Send a message to start talking with Hermes.
        </p>
      )}

      {messages.map((message) => (
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

type ChatMessage = {
  id: string
  role: string
  parts?: Array<{ type: string; text?: string }>
  content?: string
}

function getTextContent(message: ChatMessage): string {
  if (message.parts && message.parts.length > 0) {
    return message.parts
      .filter((p) => p.type === "text")
      .map((p) => p.text ?? "")
      .join("")
  }
  return message.content ?? ""
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const addMemory = useMemoryStore((state) => state.addMemory)
  const selectedProjectId = useProjectStore((state) => state.selectedProjectId)
  const isUser = message.role === "user"
  const textContent = getTextContent(message)

  const handleSaveToMemory = () => {
    addMemory({
      id: `mem_${Date.now()}`,
      userId: "user",
      projectId: selectedProjectId ?? undefined,
      type: isUser ? "decision" : "insight",
      title: textContent.slice(0, 60) + (textContent.length > 60 ? "..." : ""),
      content: textContent,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
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
        {isUser ? <span className="font-medium">U</span> : <HermesMark className="size-4 text-primary" />}
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
          {textContent}
        </div>
        {!isUser && (
          <button
            onClick={handleSaveToMemory}
            className="text-xs text-muted-foreground opacity-0 transition-opacity group-hover/msg:opacity-100 hover:text-foreground"
          >
            Save to memory
          </button>
        )}
      </div>
    </div>
  )
}
