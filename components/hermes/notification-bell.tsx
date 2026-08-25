'use client'

import { useState } from 'react'
import { Bell, X, Check, CheckCheck } from 'lucide-react'
import { useNotificationStore, type Notification } from '@/lib/notification-store'

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const notifications = useNotificationStore((state) => state.notifications)
  const unreadCount = useNotificationStore((state) => state.unreadCount)
  const markAsRead = useNotificationStore((state) => state.markAsRead)
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead)
  const clearAll = useNotificationStore((state) => state.clearAll)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        title="Notifications"
      >
        <Bell className="size-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <button
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-border bg-popover shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h3 className="text-sm font-medium text-foreground">Notifications</h3>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-primary hover:underline"
                  >
                    Mark all read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  No notifications
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-3 border-b border-border px-4 py-3 last:border-0 ${
                      !notification.read ? 'bg-primary/5' : ''
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm ${notification.read ? 'text-muted-foreground' : 'font-medium text-foreground'}`}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{notification.message}</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">
                        {new Date(notification.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="shrink-0 text-primary hover:text-primary/80"
                        title="Mark as read"
                      >
                        <Check className="size-4" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
