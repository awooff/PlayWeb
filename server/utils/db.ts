import { drizzle } from "drizzle-orm/postgres-js";
export { sql, eq, and, or } from "drizzle-orm";
import postgres from "postgres";
import * as schema from "~/server/schema";

export const tables = schema;

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL is not set");
}

const queryClient = postgres(process.env.DATABASE_URL || "", {
	prepare: false,
});

export const db = drizzle(queryClient, { schema });

export type User = typeof schema.users.$inferSelect;
export type Session = typeof schema.sessions.$inferSelect;
