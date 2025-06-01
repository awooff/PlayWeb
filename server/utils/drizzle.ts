import { drizzle } from 'drizzle-orm/node-postgres'
export { sql, eq, and, or } from 'drizzle-orm'
import { Client } from 'pg'

import * as schema from '~/server/schema'

export const tables = schema

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set')
}

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
})

// Connect to the database
client.connect().catch((err) => {
    console.error('Failed to connect to database:', err)
    process.exit(1)
})

export const db = drizzle(client, { schema })

export type User = typeof schema.users.$inferSelect
export type Session = typeof schema.sessions.$inferSelect