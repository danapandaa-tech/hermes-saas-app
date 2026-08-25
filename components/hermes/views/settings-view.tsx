'use client'

import { useState } from 'react'
import { Moon, Sun, Bell, Shield, Download, Trash2 } from 'lucide-react'
import { useTheme } from '@/lib/use-theme'
import { useAuth } from '@/lib/use-auth'
import { signOut } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'

export function SettingsView() {
  const { theme, toggle } = useTheme()
  const { user } = useAuth()
  const router = useRouter()
  
  const [notifications, setNotifications] = useState({
    patternAlerts: true,
    automationTriggers: true,
    weeklySummary: false,
  })

  return (
    <div className="flex h-full flex-col gap-6 px-4 py-6 sm:px-6">
      <div>
        <h1 className="font-heading text-2xl font-medium tracking-tight text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Customize your Hermes experience</p>
      </div>

      <div className="space-y-6">
        {/* Appearance */}
        <section className="rounded-lg border border-border bg-card p-4">
          <h3 className="font-medium text-foreground mb-4">Appearance</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground">Theme</p>
              <p className="text-xs text-muted-foreground">Choose light or dark mode</p>
            </div>
            <button
              onClick={toggle}
              className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted"
            >
              {theme === 'dark' ? <Moon className="size-4" /> : <Sun className="size-4" />}
              {theme === 'dark' ? 'Dark' : 'Light'}
            </button>
          </div>
        </section>

        {/* Notifications */}
        <section className="rounded-lg border border-border bg-card p-4">
          <h3 className="font-medium text-foreground mb-4">Notifications</h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-sm text-foreground">Pattern Alerts</p>
                <p className="text-xs text-muted-foreground">Get notified about cognitive patterns</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.patternAlerts}
                onChange={(e) => setNotifications({ ...notifications, patternAlerts: e.target.checked })}
                className="size-4 rounded border-border"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-sm text-foreground">Automation Triggers</p>
                <p className="text-xs text-muted-foreground">Notify when automations run</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.automationTriggers}
                onChange={(e) => setNotifications({ ...notifications, automationTriggers: e.target.checked })}
                className="size-4 rounded border-border"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-sm text-foreground">Weekly Summary</p>
                <p className="text-xs text-muted-foreground">Receive weekly insights summary</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.weeklySummary}
                onChange={(e) => setNotifications({ ...notifications, weeklySummary: e.target.checked })}
                className="size-4 rounded border-border"
              />
            </label>
          </div>
        </section>

        {/* Account */}
        <section className="rounded-lg border border-border bg-card p-4">
          <h3 className="font-medium text-foreground mb-4">Account</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/15 text-primary font-semibold">
                {(user?.name || user?.email || 'G').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{user?.name || 'User'}</p>
                <p className="text-xs text-muted-foreground">{user?.email || 'Not signed in'}</p>
              </div>
            </div>
            <button
              onClick={async () => {
                await signOut()
                router.push('/auth')
              }}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              Sign Out
            </button>
          </div>
        </section>

        {/* Data & Privacy */}
        <section className="rounded-lg border border-border bg-card p-4">
          <h3 className="font-medium text-foreground mb-4">Data & Privacy</h3>
          <div className="space-y-3">
            <button className="flex items-center gap-2 w-full rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted">
              <Download className="size-4" />
              Export Data
            </button>
            <button className="flex items-center gap-2 w-full rounded-lg border border-destructive/30 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10">
              <Trash2 className="size-4" />
              Delete Account
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
