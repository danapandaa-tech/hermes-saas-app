import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

function getDb() {
  if (!process.env.DATABASE_URL) return null
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  return drizzle(pool, { schema })
}

export { getDb }
export const db = new Proxy({} as ReturnType<typeof getDb>, {
  get(_, prop) {
    const d = getDb()
    if (!d) throw new Error('DATABASE_URL is not configured')
    return (d as any)[prop]
  }
})
