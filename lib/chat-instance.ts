'use client'

import { Chat } from '@ai-sdk/react'

// Lazily initialised so the Chat constructor never runs during SSR.
let _hermesChat: Chat | null = null

export function getHermesChat(): Chat {
  if (!_hermesChat) {
    _hermesChat = new Chat({ api: '/api/chat' })
  }
  return _hermesChat
}
