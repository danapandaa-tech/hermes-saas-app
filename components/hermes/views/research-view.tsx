'use client'

import { useState } from 'react'
import { Search, Globe, BookOpen, Lightbulb, ExternalLink, Save } from 'lucide-react'
import { useMemoryStore } from '@/lib/memory-store'
import { useAuth } from '@/lib/use-auth'
import { useViewStore } from '@/lib/view-store'

type SearchResult = {
  id: string
  title: string
  snippet: string
  url: string
  source: 'web' | 'local' | 'knowledge'
}

export function ResearchView() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchType, setSearchType] = useState<'web' | 'knowledge'>('web')
  
  const { userId } = useAuth()
  const addMemory = useMemoryStore((state) => state.addMemory)
  const setActiveView = useViewStore((state) => state.setActiveView)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    
    setIsSearching(true)
    
    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Mock results - in production, this would call an API
    const mockResults: SearchResult[] = searchType === 'web' ? [
      {
        id: '1',
        title: `${query} - Wikipedia`,
        snippet: 'Wikipedia article providing comprehensive information about the topic...',
        url: 'https://wikipedia.org',
        source: 'web'
      },
      {
        id: '2',
        title: `Latest research on ${query}`,
        snippet: 'Recent academic papers and studies related to your search...',
        url: 'https://scholar.google.com',
        source: 'web'
      },
      {
        id: '3',
        title: `${query} - Industry Analysis`,
        snippet: 'Market analysis and industry trends related to your query...',
        url: 'https://example.com/analysis',
        source: 'web'
      },
    ] : [
      {
        id: '1',
        title: 'Related project note',
        snippet: 'You saved a note about this topic last week...',
        url: '#',
        source: 'knowledge'
      },
    ]
    
    setResults(mockResults)
    setIsSearching(false)
  }

  const handleSaveResult = (result: SearchResult) => {
    if (!userId) return
    addMemory({
      id: `mem_${Date.now()}`,
      userId,
      type: 'insight',
      source: 'research',
      title: result.title,
      content: `${result.snippet}\n\nSource: ${result.url}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  return (
    <div className="flex h-full flex-col gap-6 px-4 py-6 sm:px-6">
      <div className="flex flex-col gap-3">
        <h1 className="font-heading text-2xl font-medium tracking-tight text-foreground">Research</h1>
        <p className="text-sm text-muted-foreground">Search the web or your knowledge base</p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="flex flex-col gap-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search anything..."
              className="w-full rounded-lg border border-border bg-background pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching || !query.trim()}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>
        
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSearchType('web')}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              searchType === 'web'
                ? 'bg-primary text-primary-foreground'
                : 'border border-border hover:bg-muted'
            }`}
          >
            <Globe className="size-3.5" />
            Web
          </button>
          <button
            type="button"
            onClick={() => setSearchType('knowledge')}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              searchType === 'knowledge'
                ? 'bg-primary text-primary-foreground'
                : 'border border-border hover:bg-muted'
            }`}
          >
            <BookOpen className="size-3.5" />
            Knowledge Base
          </button>
        </div>
      </form>

      {/* Results */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {results.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <Lightbulb className="size-12 mb-4 opacity-50" />
            <p className="text-sm">Enter a query to search</p>
            <p className="text-xs mt-1">Results will appear here</p>
          </div>
        ) : (
          results.map((result) => (
            <div key={result.id} className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-foreground truncate">{result.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{result.snippet}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <span className={`px-2 py-0.5 rounded-full ${
                      result.source === 'web' ? 'bg-blue-500/15 text-blue-600' : 'bg-purple-500/15 text-purple-600'
                    }`}>
                      {result.source === 'web' ? 'Web' : 'Knowledge'}
                    </span>
                    {result.source === 'web' && (
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 hover:text-foreground"
                      >
                        <ExternalLink className="size-3" />
                        Visit
                      </a>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleSaveResult(result)}
                  className="shrink-0 flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted"
                  title="Save to Knowledge Base"
                >
                  <Save className="size-3.5" />
                  Save
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Knowledge Graph Placeholder */}
      <div className="rounded-lg border border-dashed border-border p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <BookOpen className="size-5 text-muted-foreground" />
          <span className="font-medium">Knowledge Graph</span>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Visualize connections between your projects, notes, and insights
        </p>
        <button
          onClick={() => setActiveView('knowledge')}
          className="text-xs text-primary hover:underline"
        >
          View Knowledge Base →
        </button>
      </div>
    </div>
  )
}
