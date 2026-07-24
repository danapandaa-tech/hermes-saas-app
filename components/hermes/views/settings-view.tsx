'use client'

export function SettingsView() {
  return (
    <div className="flex h-full flex-col gap-6 px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-3">
        <h1 className="font-heading text-2xl font-medium tracking-tight text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Customize your Hermes experience</p>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border border-border bg-card/50 p-4">
          <h3 className="font-medium text-foreground">Preferences</h3>
          <p className="mt-2 text-sm text-muted-foreground">Adjust theme, notifications, and language settings.</p>
        </div>

        <div className="rounded-lg border border-border bg-card/50 p-4">
          <h3 className="font-medium text-foreground">Account</h3>
          <p className="mt-2 text-sm text-muted-foreground">Manage your account, password, and security options.</p>
        </div>

        <div className="rounded-lg border border-border bg-card/50 p-4">
          <h3 className="font-medium text-foreground">Billing</h3>
          <p className="mt-2 text-sm text-muted-foreground">View your subscription and billing information.</p>
        </div>
      </div>
    </div>
  )
}
