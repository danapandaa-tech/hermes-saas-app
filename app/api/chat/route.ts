import { streamText } from 'ai'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import { saveMessage } from '@/lib/messages'

const deepseek = createOpenAICompatible({
  name: 'openrouter',
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
})

export async function POST(request: Request) {
  const { messages } = await request.json()

  if (!process.env.OPENROUTER_API_KEY) {
    return new Response(
      JSON.stringify({
        error: 'AI service not configured. Add OPENROUTER_API_KEY to enable chat.',
      }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const userMessage = messages[messages.length - 1]?.content || ''

  if (userMessage) {
    await saveMessage('user', userMessage)
  }

  const result = streamText({
    model: deepseek('deepseek/deepseek-chat'),
    messages,
    system:
      'You are Hermes, a calm and focused AI assistant designed to help users manage their projects and tasks. You provide thoughtful, concise guidance without overwhelming the user.',
  })

  return result.toTextStreamResponse()
}
