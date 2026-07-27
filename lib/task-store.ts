import { create } from 'zustand'

export type Task = {
  id: string
  projectId: string
  userId: string
  title: string
  description?: string
  status: 'todo' | 'in-progress' | 'completed'
  dueDate?: Date
  priority: 'low' | 'medium' | 'high'
  createdAt: Date
  updatedAt: Date
}

interface TaskStore {
  tasks: Task[]
  isLoading: boolean
  error: string | null
  
  setTasks: (tasks: Task[]) => void
  addTask: (task: Task) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  getTasksByProject: (projectId: string) => Task[]
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,
  
  setTasks: (tasks) => set({ tasks }),
  
  addTask: (task) =>
    set((state) => ({
      tasks: [task, ...state.tasks],
    })),
  
  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t
      ),
    })),
  
  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    })),
  
  getTasksByProject: (projectId) => {
    const { tasks } = get()
    return tasks.filter((t) => t.projectId === projectId)
  },
  
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}))
