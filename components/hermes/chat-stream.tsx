import { cn } from "@/lib/utils"

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
      <div className="flex flex-col items-center gap-2 pb-2 text-center">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/15 ring-1 ring-primary/30">
          <span className="font-heading text-lg font-semibold text-primary">H</span>
        </div>
        <h1 className="font-heading text-balance text-xl font-semibold text-foreground">
          Lumen Rebrand
        </h1>
        <p className="text-pretty text-sm text-muted-foreground">
          A calm space to think out loud. Hermes keeps your context, memory, and workflows in sync.
        </p>
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
            ? "bg-secondary text-secondary-foreground"
            : "bg-primary/15 text-primary ring-1 ring-primary/30",
        )}
        aria-hidden="true"
      >
        {isUser ? "AM" : "H"}
      </div>
      <div className={cn("flex max-w-[80%] flex-col gap-1", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-relaxed",
            isUser
              ? "rounded-tr-sm bg-primary text-primary-foreground"
              : "rounded-tl-sm bg-card text-card-foreground ring-1 ring-border",
          )}
        >
          {message.content}
        </div>
        <span className="px-1 text-xs text-muted-foreground">{message.time}</span>
      </div>
    </div>
  )
}
