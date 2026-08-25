/**
 * app/api/cognitive/state/route.ts
 *
 * GET  /api/cognitive/state — Load the user's full cognitive document
 * PUT  /api/cognitive/state — Upsert the user's cognitive document
 *
 * Auth: requires a valid better-auth session.
 */
import { getServerAuth } from '@/lib/auth-context';
import { loadCognitiveState, saveCognitiveState } from '@/lib/cognitive/cognitiveDb';
import { putCognitiveStateRequest } from '@/lib/cognitive/validation';

export async function GET() {
  try {
    const auth = await getServerAuth();
    if (!auth) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await loadCognitiveState(auth.user.id);
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[api/cognitive] GET error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PUT(req: Request) {
  try {
    const auth = await getServerAuth();
    if (!auth) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();

    // Validate the request body
    const parsed = putCognitiveStateRequest.safeParse(body);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid request body', details: parsed.error.flatten() }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const result = await saveCognitiveState(auth.user.id, parsed.data);
    const updated = await loadCognitiveState(auth.user.id);

    return new Response(JSON.stringify({ ...updated, _meta: result }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[api/cognitive] PUT error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
