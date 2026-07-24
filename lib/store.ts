import { create } from 'zustand'

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

export const useChatStore = create<ChatStore>((set) => ({
  messages: [
    {
      id: '1',
      role: 'assistant',
      content:
        "Let's keep it calm and focused. I pulled the Lumen project context — there are 3 open tasks and a draft brief in your Vault. I'd start by locking the brand direction before touching deliverables.",
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
}))
