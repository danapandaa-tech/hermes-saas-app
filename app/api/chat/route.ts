import { streamText } from 'ai'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'

const deepseek = createOpenAICompatible({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
})

export async function POST(request: Request) {
  const { messages } = await request.json()

  const result = streamText({
    model: deepseek('deepseek/deepseek-chat'),
    messages,
    system:
      'You are Hermes, a calm and focused AI assistant designed to help users manage their projects and tasks. You provide thoughtful, concise guidance without overwhelming the user.',
  })

  return result.toTextStreamResponse()
}
