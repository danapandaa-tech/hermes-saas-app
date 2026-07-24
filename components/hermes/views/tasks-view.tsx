'use client'

import { useState } from 'react'
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react'
import { useTaskStore, type Task } from '@/lib/task-store'
import { useProjectStore } from '@/lib/project-store'
import { useAuth } from '@/lib/use-auth'

export function TasksView() {
  const { userId } = useAuth()
  const projects = useProjectStore((state) => state.projects)
  const tasks = useTaskStore((state) => state.tasks)
  const addTask = useTaskStore((state) => state.addTask)
  const updateTask = useTaskStore((state) => state.updateTask)
  const deleteTask = useTaskStore((state) => state.deleteTask)
  
  const [isCreating, setIsCreating] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDesc, setNewTaskDesc] = useState('')
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || '')
  const [newTaskDueDate, setNewTaskDueDate] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium')
  
  const handleCreateTask = () => {
    if (!newTaskTitle.trim() || !selectedProjectId) return
    
    const task: Task = {
      id: `task_${Date.now()}`,
      projectId: selectedProjectId,
      userId,
      title: newTaskTitle,
      description: newTaskDesc || undefined,
      status: 'todo',
      dueDate: newTaskDueDate ? new Date(newTaskDueDate) : undefined,
      priority: newTaskPriority,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    addTask(task)
    setNewTaskTitle('')
    setNewTaskDesc('')
    setNewTaskDueDate('')
    setNewTaskPriority('medium')
    setIsCreating(false)
  }
  
  const activeProjects = projects.filter((p) => p.status === 'active')
  const userTasks = tasks.filter((t) => t.userId === userId)
  const todoTasks = userTasks.filter((t) => t.status === 'todo')
  const inProgressTasks = userTasks.filter((t) => t.status === 'in-progress')
  const completedTasks = userTasks.filter((t) => t.status === 'completed')
  
  return (
    <div className="flex h-full w-full flex-col gap-4 overflow-hidden px-4 py-6 sm:px-6">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="font-heading text-2xl font-medium">Tasks</h2>
          <p className="text-xs text-muted-foreground">Stay on top of your work</p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="shrink-0 flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="size-4" />
          <span className="hidden sm:inline">New Task</span>
        </button>
      </div>
      
      {isCreating && (
        <div className="rounded-lg border border-border bg-muted/50 p-4">
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="mb-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {activeProjects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Task title"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="mb-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            autoFocus
          />
          <textarea
            placeholder="Description (optional)"
            value={newTaskDesc}
            onChange={(e) => setNewTaskDesc(e.target.value)}
            className="mb-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            rows={2}
          />
          <div className="mb-3 flex gap-2">
            <input
              type="date"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value as any)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCreateTask}
              className="flex-1 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90"
            >
              Create Task
            </button>
            <button
              onClick={() => setIsCreating(false)}
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium hover:bg-muted"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      <div className="min-h-0 flex-1 overflow-y-auto space-y-4">
        {userTasks.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-8 text-center">
            <p className="text-sm text-muted-foreground">No tasks yet. Create one to get started.</p>
          </div>
        ) : (
          <>
            {todoTasks.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-medium">To Do ({todoTasks.length})</h3>
                <div className="space-y-2">
                  {todoTasks.map((task) => (
                    <TaskCard key={task.id} task={task} updateTask={updateTask} deleteTask={deleteTask} projects={projects} />
                  ))}
                </div>
              </div>
            )}
            
            {inProgressTasks.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-medium">In Progress ({inProgressTasks.length})</h3>
                <div className="space-y-2">
                  {inProgressTasks.map((task) => (
                    <TaskCard key={task.id} task={task} updateTask={updateTask} deleteTask={deleteTask} projects={projects} />
                  ))}
                </div>
              </div>
            )}
            
            {completedTasks.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-medium">Completed ({completedTasks.length})</h3>
                <div className="space-y-2">
                  {completedTasks.map((task) => (
                    <TaskCard key={task.id} task={task} updateTask={updateTask} deleteTask={deleteTask} projects={projects} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function TaskCard({
  task,
  updateTask,
  deleteTask,
  projects,
}: {
  task: Task
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  projects: any[]
}) {
  const project = projects.find((p) => p.id === task.projectId)
  const priorityColor = {
    low: 'bg-blue-500/20 text-blue-600',
    medium: 'bg-yellow-500/20 text-yellow-600',
    high: 'bg-red-500/20 text-red-600',
  }[task.priority]
  
  return (
    <div className="rounded-lg border border-border bg-card/50 p-3">
      <div className="flex items-start gap-2">
        <button
          onClick={() => {
            const nextStatus = task.status === 'completed' ? 'todo' : task.status === 'todo' ? 'in-progress' : 'completed'
            updateTask(task.id, { status: nextStatus })
          }}
          className="shrink-0 mt-0.5 text-muted-foreground hover:text-foreground"
        >
          {task.status === 'completed' ? (
            <CheckCircle2 className="size-5 text-green-500" />
          ) : (
            <Circle className="size-5" />
          )}
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className={`text-sm font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
              {task.title}
            </p>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${priorityColor}`}>
              {task.priority}
            </span>
          </div>
          {project && (
            <p className="text-xs text-muted-foreground">{project.name}</p>
          )}
          {task.dueDate && (
            <p className="mt-1 text-xs text-muted-foreground">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </p>
          )}
        </div>
        <button
          onClick={() => deleteTask(task.id)}
          className="shrink-0 rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </div>
  )
}
