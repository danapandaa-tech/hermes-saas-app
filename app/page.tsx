"use client"

import { useState } from "react"
import { PanelRight } from "lucide-react"
import { NavSidebar } from "@/components/hermes/nav-sidebar"
import { ChatStream } from "@/components/hermes/chat-stream"
import { ChatInput } from "@/components/hermes/chat-input"
import { ContextPanel } from "@/components/hermes/context-panel"
import { ModeToggle, type ChatMode } from "@/components/hermes/mode-toggle"

export default function Page() {
  const [mode, setMode] = useState<ChatMode>("Chat")

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background">
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

      <ContextPanel />
    </div>
  )
}
