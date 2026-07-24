import { create } from 'zustand'

export type Project = {
  id: string
  userId: string
  name: string
  description: string
  status: 'active' | 'archived' | 'completed'
  createdAt: Date
  updatedAt: Date
}

export type ProjectWithTasks = Project & {
  taskCount: number
  completedTaskCount: number
}

interface ProjectStore {
  projects: Project[]
  selectedProjectId: string | null
  isLoading: boolean
  error: string | null
  
  setProjects: (projects: Project[]) => void
  addProject: (project: Project) => void
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void
  selectProject: (id: string | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  selectedProjectId: null,
  isLoading: false,
  error: null,
  
  setProjects: (projects) => set({ projects }),
  
  addProject: (project) =>
    set((state) => ({
      projects: [project, ...state.projects],
    })),
  
  updateProject: (id, updates) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
      ),
    })),
  
  deleteProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      selectedProjectId: state.selectedProjectId === id ? null : state.selectedProjectId,
    })),
  
  selectProject: (id) => set({ selectedProjectId: id }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}))
