# Product Plan: Hermes Operations Companion

## 1. Product Specification
**Hermes** is an AI-powered calm workspace designed for neurodivergent solopreneurs. It reduces cognitive load by unifying project management, knowledge retention, and proactive automation.

*   **Core Features:**
    *   **Contextual Brain:** Stores memory snippets, project briefs, and client preferences across sessions.
    *   **Automation Engine:** Proactive background execution (client follow-ups, social media posting, daily briefings).
    *   **Tri-Mode Workspace:** 
        *   *Chat:* Conversational project management.
        *   *Research:* Deep-dive AI research with source tracking.
        *   *Write:* Context-aware content drafting using saved brand voice.
*   **Pricing Tiers:**
    *   **Free:** Single workspace, basic chat (OpenRouter GPT-4o-mini), 5 memory snippets.
    *   **Pro ($19/mo):** Unlimited workspaces, advanced models (Claude 3.5 Sonnet), background automation, document cloud storage.

## 2. Technical Roadmap
1.  **Phase 1 (Foundation):** Integrate Supabase (Auth + Postgres) and Hono for backend API routes. Connect `chat-input` to an OpenRouter endpoint.
2.  **Phase 2 (Intelligence):** Implement vector storage (Supabase pgvector) for the "Memory" context panel.
3.  **Phase 3 (Automation):** Implement cron-based background jobs for recurring "workflows" (daily briefings/outreach).
4.  **Phase 4 (Integrations):** OAuth implementation for Google Drive/Calendar and Gmail (Zoho SMTP).

## 3. v0 Prompt for Next Iteration
> "I have a UI shell for an AI operations companion. Convert this to a functional app: 
> 1. Set up a Supabase client for authentication and Postgres database. 
> 2. Create an API route `app/api/chat/route.ts` that uses OpenRouter's 'anthropic/claude-3.5-sonnet' to handle chat input. 
> 3. Connect the `ChatStream` component to dynamically render messages from the API. 
> 4. Persist these messages in a database table named 'messages'. 
> 5. Keep the existing deep-indigo theme and Aurora glow effects."

## 4. Product Hunt Launch Strategy
*   **Positioning:** "The 'second brain' for overwhelmed creatives—finally, a workspace that remembers your client's quirks so you don't have to."
*   **Hook:** "Stop juggling tabs. Meet the AI assistant that actually runs your business in the background."
*   **Demo Video:** Focus on the "Aurora glow" UI transitioning from chat to an automation trigger (e.g., "Queue client email" -> "Email sent").
*   **Offer:** 50% off the Pro plan for the first 50 PH signups.

## 5. Distribution Strategy
*   **Gumroad/LemonSqueezy:** Use LemonSqueezy for subscription management; Gumroad for "starter kits" (e.g., 50+ pre-written AI automation prompts).
*   **Audit Funnel:** Offer a "Free AI Operations Audit" (PDF report generated via our Research mode) as a lead magnet to upsell the Pro workspace.
