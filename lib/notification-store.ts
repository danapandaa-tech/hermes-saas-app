import { create } from 'zustand'

export type NotificationType = 'pattern' | 'automation' | 'insight' | 'system'

export type Notification = {
  id: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  createdAt: Date
}

interface NotificationStore {
  notifications: Notification[]
  unreadCount: number
  
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearAll: () => void
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  
  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}`,
      createdAt: new Date(),
      read: false,
    }
    set((state) => ({
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }))
  },
  
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),
  
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),
  
  clearAll: () =>
    set({
      notifications: [],
      unreadCount: 0,
    }),
}))
