"use client"

import { useState, useRef } from "react"
import { PanelRight, Sparkles } from "lucide-react"
import { NavSidebar } from "@/components/hermes/nav-sidebar"
import { ChatStream } from "@/components/hermes/chat-stream"
import { ChatInput } from "@/components/hermes/chat-input"
import { ContextPanel } from "@/components/hermes/context-panel"
import { ModeToggle, type ChatMode } from "@/components/hermes/mode-toggle"
import { ThreadAnimation } from "@/components/hermes/thread-animation"

export default function Page() {
  const [mode, setMode] = useState<ChatMode>("Chat")
  const [threadActive, setThreadActive] = useState(false)
  const sendButtonRef = useRef<HTMLButtonElement>(null)
  const workflowRef = useRef<HTMLDivElement>(null)

  const handleThreadDemo = () => {
    setThreadActive(true)
    setTimeout(() => setThreadActive(false), 1500)
  }

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background">
      <ThreadAnimation
        isActive={threadActive}
        fromElement={sendButtonRef.current}
        toElement={workflowRef.current}
      />
      <NavSidebar />

      {/* Main chat workspace */}
      <main className="hermes-aurora flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border px-4 sm:px-6">
          <div className="min-w-0">
            <p className="truncate font-heading text-base font-semibold text-foreground">{mode}</p>
            <p className="hidden truncate text-xs text-muted-foreground sm:block">
              Your AI operations companion
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle value={mode} onChange={setMode} />
            <button
              ref={sendButtonRef}
              type="button"
              onClick={handleThreadDemo}
              className="flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/8 px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent/15"
              title="Demo: See The Thread animation when a task is created"
            >
              <Sparkles className="size-3.5" />
              <span className="hidden sm:block">Demo Thread</span>
            </button>
            <button
              type="button"
              className="flex size-9 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:text-foreground xl:hidden"
            >
              <PanelRight className="size-5" />
              <span className="sr-only">Toggle context panel</span>
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <ChatStream />
        </div>

        <div className="shrink-0">
          <ChatInput />
        </div>
      </main>

      <div ref={workflowRef}>
        <ContextPanel />
      </div>
    </div>
  )
}
