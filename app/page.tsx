"use client"

import { useState, useRef } from "react"
import { PanelRight, Sun, Moon, X } from "lucide-react"
import { NavSidebar } from "@/components/hermes/nav-sidebar"
import { ChatStream } from "@/components/hermes/chat-stream"
import { ChatInput } from "@/components/hermes/chat-input"
import { ContextPanel } from "@/components/hermes/context-panel"
import { ThreadAnimation } from "@/components/hermes/thread-animation"
import { useTheme } from "@/lib/use-theme"
import { useAuth } from "@/lib/use-auth"
import { useViewStore } from "@/lib/view-store"
import { ResearchView } from "@/components/hermes/views/research-view"
import { AutomationsView } from "@/components/hermes/views/automations-view"
import { ProjectsView } from "@/components/hermes/views/projects-view"
import { KnowledgeView } from "@/components/hermes/views/knowledge-view"
import { DocumentsView } from "@/components/hermes/views/documents-view"
import { IntegrationsView } from "@/components/hermes/views/integrations-view"
import { SettingsView } from "@/components/hermes/views/settings-view"
import { MindView } from "@/components/hermes/views/mind-view"
import { Onboarding } from "@/components/hermes/onboarding"
import { GlobalSearch } from "@/components/hermes/global-search"
import { NotificationBell } from "@/components/hermes/notification-bell"

export default function Page() {
  const [threadActive, setThreadActive] = useState(false)
  const [contextOpen, setContextOpen] = useState(true)
  const workflowRef = useRef<HTMLDivElement>(null)
  const { theme, toggle } = useTheme()
  const { isLoading: authLoading } = useAuth()
  const activeView = useViewStore((state) => state.activeView)

  if (authLoading) {
    return (
      <div className="flex h-dvh w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-xs text-muted-foreground">Loading workspace…</p>
        </div>
      </div>
    )
  }

  const handleThreadDemo = () => {
    setThreadActive(true)
    setTimeout(() => setThreadActive(false), 1500)
  }

  const renderView = () => {
    switch (activeView) {
      case "research":
        return <ResearchView />
      case "automations":
        return <AutomationsView />
      case "projects":
        return <ProjectsView />
      case "knowledge":
        return <KnowledgeView />
      case "documents":
        return <DocumentsView />
      case "integrations":
        return <IntegrationsView />
      case "settings":
        return <SettingsView />
      case "mind":
        return <MindView />
      case "chat":
      default:
        return (
          <>
            <ChatStream />
          </>
        )
    }
  }

  const isChatView = activeView === "chat"

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background">
      {threadActive && (
        <ThreadAnimation
          isActive={threadActive}
          fromElement={null}
          toElement={workflowRef.current}
        />
      )}
      <NavSidebar />
      <Onboarding />
      <GlobalSearch />

      {/* Main workspace */}
      <main className="hermes-aurora flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border px-4 sm:px-6 md:px-8">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground capitalize">{activeView}</p>
            {isChatView && (
              <p className="hidden truncate font-mono text-[11px] text-muted-foreground/60 sm:block">
                Your AI workspace
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isChatView && (
              <button
                type="button"
                onClick={handleThreadDemo}
                className="hidden sm:flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                title="Demo: See The Thread animation when a task is created"
              >
                <span>✨ Demo</span>
              </button>
            )}
            <NotificationBell />
            {/* Discrete day/night toggle */}
            <button
              type="button"
              onClick={toggle}
              aria-label={theme === "dark" ? "Switch to day mode" : "Switch to night mode"}
              title={theme === "dark" ? "Day mode" : "Night mode"}
              className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {theme === "dark" ? (
                <Sun className="size-4" />
              ) : (
                <Moon className="size-4" />
              )}
            </button>
            {isChatView && (
              <button
                type="button"
                onClick={() => setContextOpen(!contextOpen)}
                className="hidden lg:flex size-9 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:text-foreground"
              >
                <PanelRight className="size-5" />
                <span className="sr-only">Toggle context panel</span>
              </button>
            )}
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {renderView()}
        </div>

        {isChatView && (
          <div className="shrink-0 border-t border-border">
            <ChatInput />
          </div>
        )}
      </main>

      {isChatView && (
        <div ref={workflowRef} className="hidden lg:flex">
          <ContextPanel />
        </div>
      )}

      {/* Mobile context panel drawer */}
      {isChatView && contextOpen && (
        <>
          <button
            type="button"
            onClick={() => setContextOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm border-l border-border bg-background lg:hidden overflow-y-auto">
            <button
              type="button"
              onClick={() => setContextOpen(false)}
              className="absolute right-4 top-4 size-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
            >
              <X className="size-5" />
              <span className="sr-only">Close context panel</span>
            </button>
            <ContextPanel />
          </div>
        </>
      )}
    </div>
  )
}
