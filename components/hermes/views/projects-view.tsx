'use client'

import { useState } from 'react'
import { Plus, Trash2, Archive } from 'lucide-react'
import { useProjectStore, type Project } from '@/lib/project-store'
import { useAuth } from '@/lib/use-auth'
import { useTaskStore } from '@/lib/task-store'

export function ProjectsView() {
  const { userId } = useAuth()
  const projects = useProjectStore((state) => state.projects)
  const addProject = useProjectStore((state) => state.addProject)
  const updateProject = useProjectStore((state) => state.updateProject)
  const deleteProject = useProjectStore((state) => state.deleteProject)
  const selectProject = useProjectStore((state) => state.selectProject)
  const selectedProjectId = useProjectStore((state) => state.selectedProjectId)
  
  const tasks = useTaskStore((state) => state.tasks)
  const getTasksByProject = useTaskStore((state) => state.getTasksByProject)
  
  const [isCreating, setIsCreating] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectDesc, setNewProjectDesc] = useState('')
  
  const handleCreateProject = () => {
    if (!newProjectName.trim()) return
    
    const project: Project = {
      id: `proj_${Date.now()}`,
      userId,
      name: newProjectName,
      description: newProjectDesc,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    addProject(project)
    setNewProjectName('')
    setNewProjectDesc('')
    setIsCreating(false)
  }
  
  const activeProjects = projects.filter((p) => p.status === 'active')
  const selectedProject = projects.find((p) => p.id === selectedProjectId)
  const projectTasks = selectedProjectId ? getTasksByProject(selectedProjectId) : []
  const completedTasks = projectTasks.filter((t) => t.status === 'completed').length
  
  return (
    <div className="flex h-full w-full gap-4 overflow-hidden px-4 py-6 sm:px-6">
      {/* Projects List */}
      <div className="flex min-w-0 flex-1 flex-col gap-4 overflow-y-auto">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="font-heading text-2xl font-medium">Projects</h2>
            <p className="text-xs text-muted-foreground">Manage and organize your work</p>
          </div>
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="shrink-0 flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="size-4" />
            <span className="hidden sm:inline">New</span>
          </button>
        </div>
        
        {isCreating && (
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <input
              type="text"
              placeholder="Project name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="mb-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
            <textarea
              placeholder="Description (optional)"
              value={newProjectDesc}
              onChange={(e) => setNewProjectDesc(e.target.value)}
              className="mb-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              rows={2}
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreateProject}
                className="flex-1 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90"
              >
                Create
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
        
        <div className="space-y-2">
          {activeProjects.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-8 text-center">
              <p className="text-sm text-muted-foreground">No projects yet. Create one to get started.</p>
            </div>
          ) : (
            activeProjects.map((project) => (
              <button
                key={project.id}
                onClick={() => selectProject(project.id)}
                className={`w-full rounded-lg border p-3 text-left transition-colors ${
                  selectedProjectId === project.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:bg-muted/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{project.name}</p>
                    {project.description && (
                      <p className="truncate text-xs text-muted-foreground">{project.description}</p>
                    )}
                    <div className="mt-2 text-xs text-muted-foreground">
                      {projectTasks.length > 0 && (
                        <span>{completedTasks}/{projectTasks.length} tasks done</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        updateProject(project.id, { status: 'archived' })
                      }}
                      className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                      title="Archive"
                    >
                      <Archive className="size-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteProject(project.id)
                      }}
                      className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      title="Delete"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
      
      {/* Project Details */}
      {selectedProject && (
        <div className="hidden min-w-0 flex-1 flex-col gap-4 overflow-y-auto rounded-lg border border-border bg-muted/30 p-4 lg:flex">
          <div>
            <h3 className="text-lg font-semibold">{selectedProject.name}</h3>
            {selectedProject.description && (
              <p className="text-xs text-muted-foreground">{selectedProject.description}</p>
            )}
          </div>
          
          <div>
            <h4 className="mb-2 text-sm font-medium">Tasks ({projectTasks.length})</h4>
            {projectTasks.length === 0 ? (
              <p className="text-xs text-muted-foreground">No tasks yet.</p>
            ) : (
              <div className="space-y-1">
                {projectTasks.map((task) => (
                  <div key={task.id} className="rounded border border-border bg-background p-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className={`size-2 rounded-full ${task.status === 'completed' ? 'bg-green-500' : task.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-500'}`} />
                      <span className={task.status === 'completed' ? 'line-through text-muted-foreground' : ''}>{task.title}</span>
                    </div>
                    {task.dueDate && (
                      <p className="mt-1 text-[10px] text-muted-foreground">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="mt-auto border-t border-border pt-4">
            <p className="text-xs text-muted-foreground">
              Created {new Date(selectedProject.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
