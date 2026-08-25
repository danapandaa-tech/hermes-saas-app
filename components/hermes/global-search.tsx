'use client'

import { useState, useEffect, useMemo } from 'react'
import { Search, X, MessageSquare, BookOpen, FolderKanban, FileText, Brain } from 'lucide-react'
import { useViewStore } from '@/lib/view-store'
import { useMemoryStore } from '@/lib/memory-store'
import { useProjectStore } from '@/lib/project-store'
import { useAuth } from '@/lib/use-auth'

type SearchResult = {
  id: string
  type: 'memory' | 'project' | 'chat' | 'document'
  title: string
  content: string
  view: string
}

export function GlobalSearch() {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const setActiveView = useViewStore((state) => state.setActiveView)
  const memories = useMemoryStore((state) => state.memories)
  const projects = useProjectStore((state) => state.projects)
  const { userId } = useAuth()

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const results = useMemo(() => {
    if (!query.trim()) return []
    const lowerQuery = query.toLowerCase()
    const results: SearchResult[] = []

    // Search memories
    memories
      .filter((m) => m.userId === userId && (m.title.toLowerCase().includes(lowerQuery) || m.content.toLowerCase().includes(lowerQuery)))
      .slice(0, 5)
      .forEach((m) => results.push({ id: m.id, type: 'memory', title: m.title, content: m.content.slice(0, 100), view: 'knowledge' }))

    // Search projects
    projects
      .filter((p) => p.userId === userId && p.name.toLowerCase().includes(lowerQuery))
      .slice(0, 5)
      .forEach((p) => results.push({ id: p.id, type: 'project', title: p.name, content: p.description || '', view: 'projects' }))

    return results
  }, [query, memories, projects, userId])

  const typeIcons = {
    memory: BookOpen,
    project: FolderKanban,
    chat: MessageSquare,
    document: FileText,
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-background/80 backdrop-blur-sm p-4 pt-24">
      <div className="w-full max-w-lg rounded-xl border border-border bg-card shadow-xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="size-5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search memories, projects, and more..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            autoFocus
          />
          <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
            <X className="size-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {query.trim() === '' ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              Type to search across your workspace
            </div>
          ) : results.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              No results found for "{query}"
            </div>
          ) : (
            <div className="p-2">
              {results.map((result) => {
                const Icon = typeIcons[result.type]
                return (
                  <button
                    key={result.id}
                    onClick={() => {
                      setActiveView(result.view as any)
                      setIsOpen(false)
                      setQuery('')
                    }}
                    className="flex items-start gap-3 w-full rounded-lg p-3 text-left hover:bg-muted/50 transition-colors"
                  >
                    <Icon className="size-5 text-muted-foreground mt-0.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">{result.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{result.content}</p>
                    </div>
                    <span className="text-xs text-muted-foreground capitalize shrink-0">{result.type}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="border-t border-border px-4 py-2 text-center text-xs text-muted-foreground">
          Press <kbd className="px-1 py-0.5 bg-muted rounded">Esc</kbd> to close • <kbd className="px-1 py-0.5 bg-muted rounded">⌘K</kbd> to open
        </div>
      </div>
    </div>
  )
}
