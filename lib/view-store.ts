'use client'

import { create } from 'zustand'

export type ViewType = 'chat' | 'research' | 'automations' | 'projects' | 'knowledge' | 'documents' | 'integrations' | 'settings' | 'mind'

interface ViewStore {
  activeView: ViewType
  sidebarOpen: boolean
  setActiveView: (view: ViewType) => void
  toggleSidebar: () => void
  closeSidebar: () => void
}

export const useViewStore = create<ViewStore>((set) => ({
  activeView: 'chat',
  sidebarOpen: true,
  setActiveView: (view) =>
    set((state) => ({
      activeView: view,
      sidebarOpen: window.innerWidth >= 1024 ? state.sidebarOpen : false,
    })),
  toggleSidebar: () =>
    set((state) => ({
      sidebarOpen: !state.sidebarOpen,
    })),
  closeSidebar: () =>
    set({
      sidebarOpen: false,
    }),
}))
