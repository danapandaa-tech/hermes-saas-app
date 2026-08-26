# Hermes

A cognitive AI workspace that combines productivity tools with neurodivergent-friendly cognitive tracking. Hermes helps you think, research, build, and understand your own cognitive patterns.

## Features

### Core Workspace
- **Chat** — AI-powered conversations with context persistence
- **Projects** — Organize work into projects with status tracking
- **Knowledge Base** — Save insights, auto-detect patterns, visualize connections
- **Research** — Web and knowledge search with result saving
- **Documents** — Upload and manage files with preview
- **Automations** — Create scheduled workflows
- **Integrations** — Connect external services

### Mind (Cognitive OS)
- **Cognitive State Tracking** — Monitor flow, focus, overwhelm, recovery states
- **Emotional Navigator** — Log and analyze emotional patterns
- **Sensory Check-In** — Track sensory load and detect overload patterns
- **Pattern Engine** — Detect recurring cognitive patterns
- **SPARK Assessment** — 40-question cognitive profile assessment
- **Discoveries** — Capture insights, realizations, and breakthroughs
- **Personal OS** — Customized recommendations based on your profile

### UX Features
- **Onboarding** — Guided first-time experience
- **Global Search** — ⌘K to search across everything
- **Notifications** — Pattern alerts and guidance
- **Dark/Light Theme** — Toggle with system preference detection

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Auth | better-auth |
| Database | PostgreSQL (Neon) + Drizzle ORM |
| State | Zustand |
| Styling | Tailwind CSS |
| AI | Vercel AI SDK + OpenRouter |
| Payments | Stripe |

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm
- PostgreSQL database (local or Neon)

### Setup

```bash
# Clone the repository
git clone https://github.com/danapandaa-tech/hermes-saas-app.git
cd hermes-saas-app

# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env.local

# Edit .env.local with your database and API keys

# Run database migrations
pnpm drizzle-kit push

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `BETTER_AUTH_SECRET` | Auth secret (32+ chars) | Yes |
| `BETTER_AUTH_URL` | App URL (e.g. http://localhost:3000) | Yes |
| `OPENROUTER_API_KEY` | AI chat API key | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret key | No (billing) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key | No (billing) |

## Project Structure

```
hermes-saas-app/
├── app/
│   ├── page.tsx              # Main workspace page
│   ├── auth/page.tsx         # Authentication page
│   └── api/                  # API routes
│       ├── auth/             # better-auth handlers
│       ├── chat/             # AI chat endpoints
│       ├── cognitive/        # Cognitive state persistence
│       └── stripe/           # Payment webhooks
├── components/hermes/
│   ├── views/                # Main view components
│   ├── mind/                 # Cognitive OS components
│   ├── chat-*.tsx            # Chat interface
│   ├── nav-sidebar.tsx       # Navigation
│   ├── onboarding.tsx        # First-time guide
│   ├── global-search.tsx     # ⌘K search
│   └── notification-bell.tsx # Notifications
├── lib/
│   ├── cognitive/            # Cognitive OS logic
│   ├── db/                   # Database schema
│   ├── memory-store.ts       # Knowledge base store
│   ├── project-store.ts      # Projects store
│   ├── notification-store.ts # Notifications store
│   └── store.ts              # Chat store
└── drizzle/                  # Database migrations
```

## Demo Mode

For quick demos without authentication, use the "Continue as Guest" button on the auth page. This creates a local session with demo data.

## License

Private — All rights reserved.
