import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { saveMessage } from '@/lib/messages';

/**
 * DIRECT BRIDGE ROUTE
 * 
 * Purpose: This route bypasses the proxy layer and connects directly to OpenRouter via OpenAI compatibility.
 * Benefit: Maximum stability, lowest latency, and removes dependency on Eve's availability.
 * Requirement: Ensure OPENROUTER_API_KEY is set in your Vercel/Environment variables.
 */

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const userMessage = messages[messages.length - 1]?.content || '';

    // 1. Persistence: Log the incoming user message to your database
    if (userMessage) {
      try {
        await saveMessage('user', userMessage);
      } catch (e) {
        console.error("Failed to log user message:", e);
      }
    }

    // 2. Execution: Stream the response directly from OpenRouter's gateway
    const result = await streamText({
      model: openrouter('google/gemini-2.0-flash-exp:free'), 
      messages,
      onFinish: async ({ text }) => {
        // 3. Persistence: Log the AI's response back to your database
        try {
          await saveMessage('assistant', text);
        } catch (e) {
          console.error("Failed to log assistant message:", e);
        }
        console.log("Stream complete. Message logged.");
      },
    });

    // 4. Delivery: Return the stream in a format compatible with Vercel AI SDK
    return result.toDataStreamResponse();

  } catch (error: any) {
    console.error('CRITICAL_GATEWAY_ERROR:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'The connection to the intelligence gateway failed.' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
