import { streamText } from 'ai'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import { saveMessage } from '@/lib/messages'

function createProvider() {
  return createOpenAICompatible({
    name: 'openrouter',
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY!,
    headers: {
      'HTTP-Referer': 'https://hermes-saas-app.vercel.app',
      'X-Title': 'Hermes Operations Companion',
    },
  })
}

// Fallback chain: paid DeepSeek → free Gemma → free GPT-OSS → free Nemotron
const MODEL_CHAIN = [
  'deepseek/deepseek-chat',
  'google/gemma-4-26b-a4b-it:free',
  'openai/gpt-oss-20b:free',
  'nvidia/nemotron-nano-9b-v2:free',
]

export async function POST(request: Request) {
  if (!process.env.OPENROUTER_API_KEY) {
    return new Response(
      JSON.stringify({
        error: 'AI service not configured. Add OPENROUTER_API_KEY to enable chat.',
      }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const { messages } = await request.json()
  const userMessage = messages[messages.length - 1]?.content || ''

  if (userMessage) {
    try { await saveMessage('user', userMessage) } catch {}
  }

  const systemPrompt = `You are Hermes, a calm and focused AI operations companion for neurodivergent solopreneurs and creatives.

Your role:
- Help manage projects, tasks, and workflows without overwhelming the user
- Remember context across conversations
- Suggest memory-saving for important insights with a lightbulb emoji
- Be proactive about task scheduling and workflow suggestions
- Keep responses concise but complete — no walls of text
- Ask clarifying questions before taking action

Supported commands (handled client-side, just acknowledge):
- /create project [name]
- /create task [title]
- /list projects
- /list tasks

Tone: Calm, supportive, never urgent. Short paragraphs, bullet points, scannable.
You are the calm in their chaos.`

  const provider = createProvider()

  // Try each model in the fallback chain
  for (const model of MODEL_CHAIN) {
    try {
      const result = streamText({
        model: provider(model),
        messages,
        system: systemPrompt,
        max_tokens: 1000,
      })

      return result.toTextStreamResponse()
    } catch (err) {
      console.error(`Model ${model} failed:`, err)
      continue
    }
  }

  // All models failed
  return new Response(
    JSON.stringify({ error: 'All AI models are unavailable. Please try again later.' }),
    { status: 503, headers: { 'Content-Type': 'application/json' } }
  )
}
