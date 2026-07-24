import { create } from 'zustand'

export type Memory = {
  id: string
  userId: string
  projectId?: string
  type: 'insight' | 'preference' | 'context' | 'decision'
  title: string
  content: string
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
  
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}))
