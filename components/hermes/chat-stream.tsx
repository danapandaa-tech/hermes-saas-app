import { cn } from "@/lib/utils"

function HermesMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <line x1="12" y1="3" x2="12" y2="21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8.5 5.5 Q12 3.5 15.5 5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none" />
      <path d="M12 7 Q8 9 10 12 Q7 15 12 17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M12 7 Q16 9 14 12 Q17 15 12 17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  )
}

type Message = {
  id: number
  role: "user" | "hermes"
  content: string
  time: string
}

const messages: Message[] = [
  {
    id: 1,
    role: "user",
    content: "Help me prep the kickoff for the Lumen rebrand. What should I tackle first this week?",
    time: "9:02 AM",
  },
  {
    id: 2,
    role: "hermes",
    content:
      "Let's keep it calm and focused. I pulled the Lumen project context — there are 3 open tasks and a draft brief in your Vault. I'd start by locking the brand direction before touching deliverables.",
    time: "9:02 AM",
  },
  {
    id: 3,
    role: "hermes",
    content:
      "Here's a gentle plan for the week:\n• Mon — Confirm tone + moodboard with the client\n• Wed — Draft 2 logo directions\n• Fri — Send a short progress note\n\nWant me to turn this into tasks and schedule the Friday note as an automation?",
    time: "9:03 AM",
  },
  {
    id: 4,
    role: "user",
    content: "Yes, create the tasks and set up the Friday briefing automation.",
    time: "9:05 AM",
  },
  {
    id: 5,
    role: "hermes",
    content:
      "Done. I added 3 tasks to the Lumen rebrand and queued the “Daily briefing” workflow to send Friday at 4 PM. You'll see it under Active workflows on the right.",
    time: "9:05 AM",
  },
]

export function ChatStream() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6">
      <div className="flex flex-col items-center gap-3 pb-6 text-center">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-accent/10 ring-1 ring-accent/20">
          <HermesMark className="size-6 text-accent" />
        </div>
        {/* Fraunces only here: the session title is the one display moment */}
        <h1 className="font-heading text-balance text-2xl font-medium tracking-tight text-foreground">
          Lumen Rebrand
        </h1>
        <p className="max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
          A calm space to think. Hermes carries your context, tasks, and workflows so you don&apos;t have to.
        </p>
        {/* Hairline rule beneath the header block */}
        <div className="mt-2 h-px w-16 bg-accent/20" />
      </div>

      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
    </div>
  )
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user"
  return (
    <div className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}>
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
          isUser
            ? "bg-secondary/80 text-secondary-foreground"
            : "bg-accent/10 text-accent ring-1 ring-accent/20",
        )}
        aria-hidden="true"
      >
        {isUser ? (
          <span>AM</span>
        ) : (
          <HermesMark className="size-4 text-accent" />
        )}
      </div>
      <div className={cn("flex max-w-[80%] flex-col gap-1", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-relaxed",
            isUser
              ? "rounded-tr-sm bg-secondary text-secondary-foreground"
              : "rounded-tl-sm bg-card text-card-foreground ring-1 ring-border",
          )}
        >
          {message.content}
        </div>
        <span className="px-1 font-mono text-[11px] text-muted-foreground/70">{message.time}</span>
      </div>
    </div>
  )
}
