import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface ChatStore {
  messages: Message[]
  isLoading: boolean
  error: string | null
  addMessage: (message: Message) => void
  setMessages: (messages: Message[]) => void
  setIsLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      messages: [
        {
          id: '1',
          role: 'assistant',
          content:
            "Welcome to Hermes. I'm here to help you think, research, and build. What would you like to work on today?",
        },
        {
          id: '2',
          role: 'assistant',
          content:
            "Here's a gentle plan for the week:\n• Mon — Confirm tone + moodboard with the client\n• Wed — Draft 2 logo directions\n• Fri — Send a short progress note\n\nWant me to turn this into tasks and schedule the Friday note as an automation?",
        },
      ],
      isLoading: false,
      error: null,
      addMessage: (message) =>
        set((state) => ({
          messages: [...state.messages, message],
        })),
      setMessages: (messages) => set({ messages }),
      setIsLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'hermes-chat-storage',
      partialize: (state) => ({ messages: state.messages }),
    }
  )
)
