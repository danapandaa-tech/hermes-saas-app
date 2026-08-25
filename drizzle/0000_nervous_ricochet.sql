CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"accountId" text NOT NULL,
	"providerId" text NOT NULL,
	"userId" text NOT NULL,
	"accessToken" text,
	"refreshToken" text,
	"idToken" text,
	"accessTokenExpiresAt" timestamp,
	"refreshTokenExpiresAt" timestamp,
	"scope" text,
	"password" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cognitive_state" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"cognitiveState" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"profile" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"emotionalLog" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"sensoryLog" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"discoveries" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"sparkResults" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "memories" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"projectId" text,
	"content" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" text PRIMARY KEY NOT NULL,
	"workspaceId" text NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"status" text DEFAULT 'active' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"token" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"ipAddress" text,
	"userAgent" text,
	"userId" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"stripeCustomerId" text,
	"stripeSubscriptionId" text,
	"stripePriceId" text,
	"status" text DEFAULT 'free' NOT NULL,
	"currentPeriodEnd" timestamp,
	"cancelAtPeriodEnd" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subscriptions_userId_unique" UNIQUE("userId"),
	CONSTRAINT "subscriptions_stripeCustomerId_unique" UNIQUE("stripeCustomerId"),
	CONSTRAINT "subscriptions_stripeSubscriptionId_unique" UNIQUE("stripeSubscriptionId")
);
--> statement-breakpoint
CREATE TABLE "usage" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"period" text NOT NULL,
	"tasksCreated" integer DEFAULT 0 NOT NULL,
	"projectsCreated" integer DEFAULT 0 NOT NULL,
	"workflowsCreated" integer DEFAULT 0 NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "usage_userId_period_key" UNIQUE("userId","period")
);
--> statement-breakpoint
CREATE TABLE "usage_counters" (
	"userId" text NOT NULL,
	"month" text NOT NULL,
	"workflowRunsCount" integer DEFAULT 0 NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "usage_counters_userId_month_key" UNIQUE("userId","month")
);
--> statement-breakpoint
CREATE TABLE "usage_events" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"kind" text NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"emailVerified" boolean DEFAULT false NOT NULL,
	"image" text,
	"stripeCustomerId" text,
	"tier" text DEFAULT 'free' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "workflows" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"projectId" text,
	"workspaceId" text,
	"name" text NOT NULL,
	"title" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"sourceMessageId" text,
	"schedule" text,
	"lastRunAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workspaces" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"name" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cognitive_state" ADD CONSTRAINT "cognitive_state_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;