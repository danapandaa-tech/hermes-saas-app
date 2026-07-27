'use client'

import { useState } from 'react'
import { Plus, Trash2, ToggleLeft } from 'lucide-react'
import { useAutomationStore, type Automation } from '@/lib/automation-store'
import { useProjectStore } from '@/lib/project-store'
import { useAuth } from '@/lib/use-auth'

export function AutomationsView() {
  const { userId } = useAuth()
  const automations = useAutomationStore((state) => state.automations)
  const addAutomation = useAutomationStore((state) => state.addAutomation)
  const updateAutomation = useAutomationStore((state) => state.updateAutomation)
  const deleteAutomation = useAutomationStore((state) => state.deleteAutomation)
  const toggleAutomation = useAutomationStore((state) => state.toggleAutomation)
  
  const projects = useProjectStore((state) => state.projects).filter((p) => p.status === 'active')
  
  const [isCreating, setIsCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newTrigger, setNewTrigger] = useState<'scheduled' | 'webhook' | 'manual'>('scheduled')
  const [newAction, setNewAction] = useState<'create-task' | 'send-reminder' | 'update-project' | 'custom'>('create-task')
  const [newSchedule, setNewSchedule] = useState('0 9 * * MON') // Monday 9am
  
  const handleCreate = () => {
    if (!newName.trim()) return
    
    const automation: Automation = {
      id: `auto_${Date.now()}`,
      userId,
      name: newName,
      description: newDesc || undefined,
      trigger: newTrigger,
      action: newAction,
      schedule: newTrigger === 'scheduled' ? newSchedule : undefined,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    addAutomation(automation)
    setNewName('')
    setNewDesc('')
    setIsCreating(false)
  }
  
  const userAutomations = automations.filter((a) => a.userId === userId)
  const activeCount = userAutomations.filter((a) => a.isActive).length
  
  return (
    <div className="flex h-full w-full flex-col gap-4 overflow-hidden px-4 py-6 sm:px-6">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="font-heading text-2xl font-medium">Automations</h2>
          <p className="text-xs text-muted-foreground">Create workflows to automate repetitive tasks</p>
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
            placeholder="Automation name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="mb-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            autoFocus
          />
          <textarea
            placeholder="Description (optional)"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            className="mb-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            rows={2}
          />
          <div className="mb-3 grid grid-cols-2 gap-2">
            <select
              value={newTrigger}
              onChange={(e) => setNewTrigger(e.target.value as any)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="scheduled">Scheduled</option>
              <option value="webhook">Webhook</option>
              <option value="manual">Manual</option>
            </select>
            <select
              value={newAction}
              onChange={(e) => setNewAction(e.target.value as any)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="create-task">Create Task</option>
              <option value="send-reminder">Send Reminder</option>
              <option value="update-project">Update Project</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          {newTrigger === 'scheduled' && (
            <input
              type="text"
              placeholder="Cron expression (e.g., 0 9 * * MON)"
              value={newSchedule}
              onChange={(e) => setNewSchedule(e.target.value)}
              className="mb-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          )}
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
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
      
      <div className="min-h-0 flex-1 overflow-y-auto space-y-2">
        {userAutomations.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-8 text-center">
            <p className="text-sm text-muted-foreground">No automations yet. Create one to get started.</p>
          </div>
        ) : (
          <>
            <div className="text-xs text-muted-foreground">
              {activeCount} active automation{activeCount !== 1 ? 's' : ''}
            </div>
            {userAutomations.map((automation) => (
              <div key={automation.id} className="rounded-lg border border-border bg-card/50 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{automation.name}</p>
                    {automation.description && (
                      <p className="text-xs text-muted-foreground">{automation.description}</p>
                    )}
                    <div className="mt-1 flex flex-wrap gap-1">
                      <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs text-primary">
                        {automation.trigger}
                      </span>
                      <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-xs text-blue-600">
                        {automation.action.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => toggleAutomation(automation.id)}
                      className={`rounded p-1 ${automation.isActive ? 'text-green-600 hover:bg-green-500/10' : 'text-muted-foreground hover:bg-muted'}`}
                      title={automation.isActive ? 'Disable' : 'Enable'}
                    >
                      <ToggleLeft className="size-4" />
                    </button>
                    <button
                      onClick={() => deleteAutomation(automation.id)}
                      className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
