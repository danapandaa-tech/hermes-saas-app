import { create } from 'zustand'

export type MemorySource = 'chat' | 'mind' | 'research' | 'manual' | 'project'

export type Memory = {
  id: string
  userId: string
  projectId?: string
  type: 'insight' | 'preference' | 'context' | 'decision'
  source: MemorySource
  title: string
  content: string
  relatedIds?: string[] // IDs of related memories for graph connections
  createdAt: Date
  updatedAt: Date
}

interface MemoryStore {
  memories: Memory[]
  isLoading: boolean
  error: string | null
  
  setMemories: (memories: Memory[]) => void
  addMemory: (memory: Memory) => void
  updateMemory: (id: string, updates: Partial<Memory>) => void
  deleteMemory: (id: string) => void
  getProjectMemories: (projectId: string) => Memory[]
  searchMemories: (query: string) => Memory[]
  getMemoriesBySource: (source: MemorySource) => Memory[]
  getRelatedMemories: (memoryId: string) => Memory[]
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useMemoryStore = create<MemoryStore>((set, get) => ({
  memories: [],
  isLoading: false,
  error: null,
  
  setMemories: (memories) => set({ memories }),
  
  addMemory: (memory) =>
    set((state) => ({
      memories: [memory, ...state.memories],
    })),
  
  updateMemory: (id, updates) =>
    set((state) => ({
      memories: state.memories.map((m) =>
        m.id === id ? { ...m, ...updates, updatedAt: new Date() } : m
      ),
    })),
  
  deleteMemory: (id) =>
    set((state) => ({
      memories: state.memories.filter((m) => m.id !== id),
    })),
  
  getProjectMemories: (projectId) => {
    const { memories } = get()
    return memories.filter((m) => m.projectId === projectId)
  },
  
  searchMemories: (query) => {
    const { memories } = get()
    const lowerQuery = query.toLowerCase()
    return memories.filter(
      (m) =>
        m.title.toLowerCase().includes(lowerQuery) ||
        m.content.toLowerCase().includes(lowerQuery)
    )
  },

  getMemoriesBySource: (source) => {
    const { memories } = get()
    return memories.filter((m) => m.source === source)
  },

  getRelatedMemories: (memoryId) => {
    const { memories } = get()
    const memory = memories.find((m) => m.id === memoryId)
    if (!memory || !memory.relatedIds) return []
    return memories.filter((m) => memory.relatedIds?.includes(m.id))
  },
  
  setLoading: (loading) => set({ isLoading }),
  setError: (error) => set({ error }),
}))
