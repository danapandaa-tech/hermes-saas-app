import { loadMessages } from '@/lib/messages'

export async function GET() {
  const messages = await loadMessages()
  return Response.json({ messages })
}
