import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core'

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  stripeCustomerId: text('stripeCustomerId'),
  tier: text('tier').notNull().default('free'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

export const workspaces = pgTable('workspaces', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  name: text('name').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const messages = pgTable('messages', {
  id: text('id').primaryKey(),
  workspaceId: text('workspaceId').notNull(),
  role: text('role').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const projects = pgTable('projects', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  status: text('status').notNull().default('active'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const memories = pgTable('memories', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  projectId: text('projectId'),
  content: text('content').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const workflows = pgTable('workflows', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  projectId: text('projectId'),
  workspaceId: text('workspaceId'),
  name: text('name').notNull(),
  title: text('title'),
  status: text('status').notNull().default('pending'),
  sourceMessageId: text('sourceMessageId'),
  schedule: text('schedule'),
  lastRunAt: timestamp('lastRunAt'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const subscriptions = pgTable('subscriptions', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().unique(),
  stripeCustomerId: text('stripeCustomerId').unique(),
  stripeSubscriptionId: text('stripeSubscriptionId').unique(),
  stripePriceId: text('stripePriceId'),
  status: text('status').notNull().default('free'),
  currentPeriodEnd: timestamp('currentPeriodEnd'),
  cancelAtPeriodEnd: boolean('cancelAtPeriodEnd').notNull().default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const usage = pgTable(
  'usage',
  {
    id: serial('id').primaryKey(),
    userId: text('userId').notNull(),
    period: text('period').notNull(),
    tasksCreated: integer('tasksCreated').notNull().default(0),
    projectsCreated: integer('projectsCreated').notNull().default(0),
    workflowsCreated: integer('workflowsCreated').notNull().default(0),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  },
  (table) => [
    unique('usage_userId_period_key').on(table.userId, table.period),
  ],
)

export const usageEvents = pgTable('usage_events', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  kind: text('kind').notNull(),
  quantity: integer('quantity').notNull().default(1),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const usageCounters = pgTable(
  'usage_counters',
  {
    userId: text('userId').notNull(),
    month: text('month').notNull(),
    workflowRunsCount: integer('workflowRunsCount').notNull().default(0),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  },
  (table) => [
    unique('usage_counters_userId_month_key').on(table.userId, table.month),
  ],
)


// ─── Cognitive State (ND Cognitive OS integration) ──────────────────────────
// Stores the full cognitive document per user: state machine, profile,
// emotional/sensory logs, discoveries, and SPARK results as JSONB.
export const cognitiveState = pgTable('cognitive_state', {
  id: text('id').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  cognitiveState: jsonb('cognitiveState').notNull().default({}),
  profile: jsonb('profile').notNull().default({}),
  emotionalLog: jsonb('emotionalLog').notNull().default([]),
  sensoryLog: jsonb('sensoryLog').notNull().default([]),
  discoveries: jsonb('discoveries').notNull().default([]),
  sparkResults: jsonb('sparkResults'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})
