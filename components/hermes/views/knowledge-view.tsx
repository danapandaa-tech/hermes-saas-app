'use client'

import { useState, useMemo } from 'react'
import { Trash2, Search, Brain, Sparkles, Network, MessageSquare, BookOpen } from 'lucide-react'
import { useMemoryStore, type MemorySource } from '@/lib/memory-store'
import { useAuth } from '@/lib/use-auth'
import { useProjectStore } from '@/lib/project-store'
import { generateMindInsights, insightToMemory } from '@/lib/cognitive/mindToKnowledge'

export function KnowledgeView() {
  const { userId } = useAuth()
  const memories = useMemoryStore((state) => state.memories)
  const addMemory = useMemoryStore((state) => state.addMemory)
  const deleteMemory = useMemoryStore((state) => state.deleteMemory)
  const projects = useProjectStore((state) => state.projects)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'insight' | 'preference' | 'context' | 'decision'>('all')
  const [filterSource, setFilterSource] = useState<'all' | MemorySource>('all')
  const [viewMode, setViewMode] = useState<'list' | 'graph'>('list')
  const [selectedMemory, setSelectedMemory] = useState<string | null>(null)
  
  const userMemories = memories.filter((m) => m.userId === userId)
  
  // Generate mind insights
  const mindInsights = useMemo(() => {
    if (!userId) return []
    return generateMindInsights(userId)
  }, [userId, userMemories.length]) // Re-generate when memories change

  const filtered = useMemo(() => {
    let result = userMemories
    if (searchQuery) {
      result = result.filter((m) =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    if (filterType !== 'all') {
      result = result.filter((m) => m.type === filterType)
    }
    if (filterSource !== 'all') {
      result = result.filter((m) => m.source === filterSource)
    }
    return result
  }, [userMemories, searchQuery, filterType, filterSource])

  const handleSaveMindInsight = (insight: typeof mindInsights[0]) => {
    if (!userId) return
    const memory = {
      ...insightToMemory(insight, userId),
      id: `mem_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    addMemory(memory)
  }

  const typeColors = {
    insight: 'bg-blue-500/15 text-blue-600',
    preference: 'bg-purple-500/15 text-purple-600',
    context: 'bg-green-500/15 text-green-600',
    decision: 'bg-orange-500/15 text-orange-600',
  }

  const sourceIcons = {
    chat: MessageSquare,
    mind: Brain,
    research: BookOpen,
    manual: Sparkles,
    project: Network,
  }

  // Stats for graph view
  const stats = useMemo(() => ({
    total: userMemories.length,
    byType: {
      insight: userMemories.filter((m) => m.type === 'insight').length,
      preference: userMemories.filter((m) => m.type === 'preference').length,
      context: userMemories.filter((m) => m.type === 'context').length,
      decision: userMemories.filter((m) => m.type === 'decision').length,
    },
    bySource: {
      chat: userMemories.filter((m) => m.source === 'chat').length,
      mind: userMemories.filter((m) => m.source === 'mind').length,
      research: userMemories.filter((m) => m.source === 'research').length,
      manual: userMemories.filter((m) => m.source === 'manual').length,
      project: userMemories.filter((m) => m.source === 'project').length,
    },
    byProject: projects.map((p) => ({
      id: p.id,
      name: p.name,
      count: userMemories.filter((m) => m.projectId === p.id).length,
    })).filter((p) => p.count > 0),
  }), [userMemories, projects])

  return (
    <div className="flex h-full w-full flex-col gap-4 overflow-hidden px-4 py-6 sm:px-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-medium">Knowledge Base</h2>
          <p className="text-xs text-muted-foreground">Your saved insights, decisions, and context</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'border border-border hover:bg-muted'
            }`}
          >
            List
          </button>
          <button
            onClick={() => setViewMode('graph')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              viewMode === 'graph' ? 'bg-primary text-primary-foreground' : 'border border-border hover:bg-muted'
            }`}
          >
            Graph
          </button>
        </div>
      </div>

      {/* Mind Insights Banner */}
      {mindInsights.length > 0 && viewMode === 'list' && (
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="size-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Mind Insights</span>
            <span className="text-xs text-muted-foreground">({mindInsights.length} detected)</span>
          </div>
          <div className="space-y-2">
            {mindInsights.slice(0, 3).map((insight, idx) => (
              <div key={idx} className="flex items-start justify-between gap-2 rounded bg-background/50 p-2">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-foreground">{insight.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{insight.content}</p>
                </div>
                <button
                  onClick={() => handleSaveMindInsight(insight)}
                  className="shrink-0 rounded bg-primary px-2 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Save
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
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
              filterType === 'all' ? 'bg-primary text-primary-foreground' : 'border border-border hover:bg-muted'
            }`}
          >
            All Types
          </button>
          {(['insight', 'preference', 'context', 'decision'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                filterType === type ? `${typeColors[type]} border` : 'border border-border hover:bg-muted'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterSource('all')}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              filterSource === 'all' ? 'bg-primary text-primary-foreground' : 'border border-border hover:bg-muted'
            }`}
          >
            All Sources
          </button>
          {(['chat', 'mind', 'research', 'manual'] as const).map((source) => {
            const Icon = sourceIcons[source]
            return (
              <button
                key={source}
                onClick={() => setFilterSource(source)}
                className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  filterSource === source ? 'bg-primary text-primary-foreground' : 'border border-border hover:bg-muted'
                }`}
              >
                <Icon className="size-3" />
                {source}
              </button>
            )
          })}
        </div>
      </div>

      {/* Content */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {viewMode === 'list' ? (
          <div className="space-y-2">
            {filtered.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  {userMemories.length === 0 
                    ? 'No memories saved yet. Save insights from chat, mind, or research to build your knowledge base.'
                    : 'No matches found.'}
                </p>
              </div>
            ) : (
              filtered.map((memory) => {
                const project = memory.projectId ? projects.find((p) => p.id === memory.projectId) : null
                const SourceIcon = sourceIcons[memory.source || 'manual']
                const isSelected = selectedMemory === memory.id
                const relatedMemories = memory.relatedIds 
                  ? userMemories.filter((m) => memory.relatedIds?.includes(m.id))
                  : []

                return (
                  <div
                    key={memory.id}
                    onClick={() => setSelectedMemory(isSelected ? null : memory.id)}
                    className={`rounded-lg border bg-card/50 p-3 cursor-pointer transition-all ${
                      isSelected ? 'border-primary ring-1 ring-primary' : 'border-border hover:border-border/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <SourceIcon className="size-3.5 text-muted-foreground" />
                          <p className="font-medium truncate">{memory.title}</p>
                          <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${typeColors[memory.type]}`}>
                            {memory.type}
                          </span>
                        </div>
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{memory.content}</p>
                        <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
                          {project && <span className="flex items-center gap-1"><Network className="size-3" />{project.name}</span>}
                          <span>{new Date(memory.createdAt).toLocaleDateString()}</span>
                        </div>
                        {isSelected && relatedMemories.length > 0 && (
                          <div className="mt-2 border-t border-border pt-2">
                            <p className="text-xs font-medium text-muted-foreground mb-1">Related ({relatedMemories.length})</p>
                            {relatedMemories.map((rm) => (
                              <p key={rm.id} className="text-xs text-muted-foreground truncate">{rm.title}</p>
                            ))}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteMemory(memory.id) }}
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
        ) : (
          /* Graph View */
          <div className="space-y-4">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-lg border border-border bg-card p-3 text-center">
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
              <div className="rounded-lg border border-border bg-card p-3 text-center">
                <p className="text-2xl font-bold text-blue-600">{stats.byType.insight}</p>
                <p className="text-xs text-muted-foreground">Insights</p>
              </div>
              <div className="rounded-lg border border-border bg-card p-3 text-center">
                <p className="text-2xl font-bold text-purple-600">{stats.byType.preference}</p>
                <p className="text-xs text-muted-foreground">Preferences</p>
              </div>
              <div className="rounded-lg border border-border bg-card p-3 text-center">
                <p className="text-2xl font-bold text-orange-600">{stats.byType.decision}</p>
                <p className="text-xs text-muted-foreground">Decisions</p>
              </div>
            </div>

            {/* By Source */}
            <div className="rounded-lg border border-border bg-card p-4">
              <h3 className="text-sm font-medium text-foreground mb-3">By Source</h3>
              <div className="space-y-2">
                {Object.entries(stats.bySource).map(([source, count]) => {
                  const Icon = sourceIcons[source as keyof typeof sourceIcons]
                  const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0
                  return (
                    <div key={source} className="flex items-center gap-3">
                      <Icon className="size-4 text-muted-foreground" />
                      <span className="text-xs text-foreground capitalize w-16">{source}</span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${percentage}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground w-8 text-right">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* By Project */}
            {stats.byProject.length > 0 && (
              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="text-sm font-medium text-foreground mb-3">By Project</h3>
                <div className="space-y-2">
                  {stats.byProject.map((p) => (
                    <div key={p.id} className="flex items-center justify-between">
                      <span className="text-xs text-foreground">{p.name}</span>
                      <span className="text-xs text-muted-foreground">{p.count} memories</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Connections Info */}
            <div className="rounded-lg border border-dashed border-border p-4 text-center">
              <Network className="mx-auto size-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Knowledge graph connections are built automatically as you save memories.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Memories from the same project or with similar topics will be linked.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
