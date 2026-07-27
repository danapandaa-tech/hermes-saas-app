export const runtime = 'edge'

const EVE_AGENT_URL = process.env.EVE_AGENT_URL || 'https://atelier-agent-virid.vercel.app/api/ach'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { messages } = body

    // Prepare the payload for Eve agent
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

    const payload = {
      messages,
      system: systemPrompt,
      model: 'gpt-4o-mini',
      max_tokens: 1000,
      stream: true,
    }

    // Create request headers, preserving any auth/custom headers from client
    const headers = new Headers({
      'Content-Type': 'application/json',
    })

    // Forward any authorization or custom headers from the original request
    const authHeader = request.headers.get('authorization')
    if (authHeader) {
      headers.set('authorization', authHeader)
    }

    // Make the request to Eve agent with explicit streaming support
    const response = await fetch(EVE_AGENT_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    })

    // Check for error responses
    if (!response.ok) {
      const errorText = await response.text()
      console.error('[v0] Eve agent error:', response.status, errorText)

      return new Response(
        `data: ${JSON.stringify({
          error: `Eve agent error: ${response.status}`,
          details: errorText.slice(0, 200),
        })}\n\n`,
        {
          status: 200, // Return 200 with error in stream so client can parse it
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          },
        }
      )
    }

    // Stream the response directly from Eve agent to client
    // This ensures no buffering and preserves the stream integrity
    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('No response body from Eve agent')
    }

    // Create a passthrough stream
    const stream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) {
              controller.close()
              break
            }
            controller.enqueue(value)
          }
        } catch (err) {
          console.error('[v0] Stream error:', err)
          controller.error(err)
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('[v0] Chat proxy error:', error)

    // Return error in SSE format so client can parse it
    return new Response(
      `data: ${JSON.stringify({
        error: 'Failed to connect to AI service',
        details: error instanceof Error ? error.message : 'Unknown error',
      })}\n\n`,
      {
        status: 200, // Return 200 with error in stream
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
        },
      }
    )
  }
}
