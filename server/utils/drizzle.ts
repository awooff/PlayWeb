import { drizzle } from 'drizzle-orm/node-postgres'
export { sql, eq, and, or } from 'drizzle-orm'
import { Pool } from 'pg'

import * as schema from '~/server/schema'

export const tables = schema

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set')
}

// Create a connection pool instead of a single client
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    },
    max: 10, // maximum number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
    connectionTimeoutMillis: 2000, // how long to wait before timing out when connecting a new client
})

// The pool will emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err)
})

// When the app is shutting down
process.on('SIGTERM', () => {
    pool.end().then(() => {
        console.log('Pool has ended')
    })
})

export const db = drizzle(pool, { schema })

export type User = typeof schema.users.$inferSelect
export type Session = typeof schema.sessions.$inferSelect