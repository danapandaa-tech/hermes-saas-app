import { create } from 'zustand'

export type Automation = {
  id: string
  userId: string
  projectId?: string
  name: string
  description?: string
  trigger: 'scheduled' | 'webhook' | 'manual'
  action: 'create-task' | 'send-reminder' | 'update-project' | 'custom'
  schedule?: string // cron expression for scheduled
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

interface AutomationStore {
  automations: Automation[]
  isLoading: boolean
  error: string | null
  
  setAutomations: (automations: Automation[]) => void
  addAutomation: (automation: Automation) => void
  updateAutomation: (id: string, updates: Partial<Automation>) => void
  deleteAutomation: (id: string) => void
  toggleAutomation: (id: string) => void
  getProjectAutomations: (projectId: string) => Automation[]
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useAutomationStore = create<AutomationStore>((set, get) => ({
  automations: [],
  isLoading: false,
  error: null,
  
  setAutomations: (automations) => set({ automations }),
  
  addAutomation: (automation) =>
    set((state) => ({
      automations: [automation, ...state.automations],
    })),
  
  updateAutomation: (id, updates) =>
    set((state) => ({
      automations: state.automations.map((a) =>
        a.id === id ? { ...a, ...updates, updatedAt: new Date() } : a
      ),
    })),
  
  deleteAutomation: (id) =>
    set((state) => ({
      automations: state.automations.filter((a) => a.id !== id),
    })),
  
  toggleAutomation: (id) =>
    set((state) => ({
      automations: state.automations.map((a) =>
        a.id === id ? { ...a, isActive: !a.isActive, updatedAt: new Date() } : a
      ),
    })),
  
  getProjectAutomations: (projectId) => {
    const { automations } = get()
    return automations.filter((a) => a.projectId === projectId)
  },
  
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}))
