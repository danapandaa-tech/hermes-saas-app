'use client'

import { useState } from 'react'
import { Trash2, Search } from 'lucide-react'
import { useMemoryStore } from '@/lib/memory-store'
import { useAuth } from '@/lib/use-auth'
import { useProjectStore } from '@/lib/project-store'

export function KnowledgeView() {
  const { userId } = useAuth()
  const memories = useMemoryStore((state) => state.memories)
  const searchMemories = useMemoryStore((state) => state.searchMemories)
  const deleteMemory = useMemoryStore((state) => state.deleteMemory)
  const projects = useProjectStore((state) => state.projects)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'insight' | 'preference' | 'context' | 'decision'>('all')
  
  const userMemories = memories.filter((m) => m.userId === userId)
  const filtered = searchQuery 
    ? userMemories.filter((m) => 
        (filterType === 'all' || m.type === filterType) &&
        (m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
         m.content.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : userMemories.filter((m) => filterType === 'all' || m.type === filterType)
  
  const typeColors = {
    insight: 'bg-blue-500/15 text-blue-600',
    preference: 'bg-purple-500/15 text-purple-600',
    context: 'bg-green-500/15 text-green-600',
    decision: 'bg-orange-500/15 text-orange-600',
  }
  
  return (
    <div className="flex h-full w-full flex-col gap-4 overflow-hidden px-4 py-6 sm:px-6">
      <div>
        <h2 className="font-heading text-2xl font-medium">Knowledge Base</h2>
        <p className="text-xs text-muted-foreground">Your saved insights, decisions, and context</p>
      </div>
      
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search memories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-background pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              filterType === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'border border-border hover:bg-muted'
            }`}
          >
            All
          </button>
          {(['insight', 'preference', 'context', 'decision'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                filterType === type
                  ? `${typeColors[type]} border`
                  : 'border border-border hover:bg-muted'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
      
      <div className="min-h-0 flex-1 overflow-y-auto space-y-2">
        {filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-8 text-center">
            <p className="text-sm text-muted-foreground">
              {userMemories.length === 0 
                ? 'No memories saved yet. Save important insights from chat to build your knowledge base.'
                : 'No matches found.'}
            </p>
          </div>
        ) : (
          filtered.map((memory) => {
            const project = memory.projectId ? projects.find((p) => p.id === memory.projectId) : null
            return (
              <div key={memory.id} className="rounded-lg border border-border bg-card/50 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{memory.title}</p>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${typeColors[memory.type]}`}>
                        {memory.type}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{memory.content}</p>
                    <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
                      {project && <span>{project.name}</span>}
                      <span>{new Date(memory.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteMemory(memory.id)}
                    className="shrink-0 rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
