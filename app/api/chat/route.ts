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

  // Build enhanced system prompt with context awareness
  // This acknowledges projects, tasks, and previous decisions
  const systemPrompt = `You are Hermes, a calm and focused AI assistant designed to help users manage their projects and tasks.

You provide thoughtful, concise guidance without overwhelming the user. You are context-aware and understand:
- Active projects and their status
- Upcoming tasks and deadlines  
- Previous decisions and insights (saved in memory)
- Work automation workflows

Always:
1. Reference context when relevant (e.g., "I see you're working on the Lumen project...")
2. Suggest memory-saving for important insights with 💡
3. Be proactive about task scheduling and workflow suggestions
4. Keep responses concise but complete
5. Ask clarifying questions if needed before taking action

Supported shortcuts:
- /create project [name] - Create a new project
- /create task [title] - Create a task
- /list projects - Show active projects
- /list tasks - Show all tasks
- /schedule [action] [time] - Schedule a task or reminder

Help users think clearly and stay organized.`

  try {
    const result = streamText({
      model: deepseek('deepseek-chat'),
      messages,
      system: systemPrompt,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error('[v0] Chat API error:', error)
    return new Response(
      JSON.stringify({
        error: 'Failed to get AI response. Please try again.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
