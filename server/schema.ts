import { pgTable, varchar, timestamp, text } from 'drizzle-orm/pg-core';

export const users = pgTable('user', {
  id: varchar('id', { length: 36 }).primaryKey(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password_hash: text('password_hash').notNull(),
  avatar: varchar('avatar', { length: 255 }).default('/default-avatar.png'),
  role: varchar('role', { length: 50 }).default('user').notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).notNull(),
});

export const sessions = pgTable('session', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('userId', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expiresAt', { withTimezone: true }).notNull(),
});
