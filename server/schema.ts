//
// IMPORTANT:
// ----------------------------------------------------
// https://orm.drizzle.team/docs/rls#using-with-neon
//
// ^^^^^^ CHECK THIS URL BEFORE DOING ANYTHING. ^^^^^^^
//

import { crudPolicy, anonymousRole, authenticatedRole } from "drizzle-orm/neon";
import {
	pgTable,
	pgRole,
	varchar,
	timestamp,
	text,
	type AnyPgColumn,
	integer,
	boolean,
	index,
} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { desc, relations, sql } from "drizzle-orm";

export const admin = pgRole("admin");
export const user = pgRole("user");

export const authUid = (userIdColumn: AnyPgColumn) =>
	sql`(select auth.user_id() = ${userIdColumn})`;

export const users = pgTable("user", {
	id: varchar("id", { length: 36 }).primaryKey().$defaultFn(createId),
	username: varchar("username", { length: 255 })
		.notNull()
		.unique()
		.default(sql`auth.user_id()`),
	email: varchar("email", { length: 255 }).notNull().unique(),
	password_hash: text("password_hash").notNull(),
	avatar: varchar("avatar", { length: 255 }).default("/default-avatar.png"),
	role: varchar("role", { length: 50 }).default("user").notNull(),
	created_at: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updated_at: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export const sessions = pgTable("session", {
	id: varchar("id", { length: 36 }).primaryKey(),
	userId: varchar("userId", { length: 36 })
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	expiresAt: timestamp("expiresAt", { withTimezone: true }).notNull(),
});

export const forumGroups = pgTable(
	"forum_group",
	{
		id: varchar("id", { length: 36 }).primaryKey().$defaultFn(createId),
		name: varchar("name", { length: 100 }).notNull(),
		description: text("description"),
		slug: varchar("slug", { length: 100 }).notNull().unique(),
		owner: varchar("owner_id", { length: 36 })
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		is_active: boolean("is_active").default(true).notNull(),
		sort_order: integer("sort_order").default(0).notNull(),
		created_at: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
		updated_at: timestamp("updated_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(table) => [
		// Indexes
		index("forum_groups_slug_idx").on(table.slug),
		index("forum_groups_sort_order_idx").on(table.sort_order),
		index("forum_groups_owner_idx").on(table.owner),

		// RLS Policies
		crudPolicy({
			role: anonymousRole,
			read: sql`${table.is_active} = true`, // anonymous can only read active groups
			modify: false,
		}),
		crudPolicy({
			role: authenticatedRole,
			read: true, // authenticated users can read all groups
			modify: authUid(table.owner), // only owner can modify
		}),
	],
);

export const forumThreads = pgTable(
	"forum_thread",
	{
		id: varchar("id", { length: 36 }).primaryKey().$defaultFn(createId),
		title: varchar("title", { length: 255 }).notNull(),
		slug: varchar("slug", { length: 255 }).notNull(),
		content: text("content").notNull(),

		// Foreign keys
		group_id: varchar("group_id", { length: 36 })
			.notNull()
			.references(() => forumGroups.id, { onDelete: "cascade" }),
		author_id: varchar("author_id", { length: 36 })
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),

		// Thread metadata
		is_pinned: boolean("is_pinned").default(false).notNull(),
		is_locked: boolean("is_locked").default(false).notNull(),
		is_deleted: boolean("is_deleted").default(false).notNull(),

		// Counts (denormalized for performance)
		post_count: integer("post_count").default(0).notNull(),
		view_count: integer("view_count").default(0).notNull(),

		// Last activity tracking
		last_post_id: varchar("last_post_id", { length: 36 }),
		last_post_at: timestamp("last_post_at", { withTimezone: true }),
		last_post_author_id: varchar("last_post_author_id", { length: 36 }),

		created_at: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
		updated_at: timestamp("updated_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(table) => [
		// Indexes
		index("forum_threads_group_id_idx").on(table.group_id),
		index("forum_threads_author_id_idx").on(table.author_id),
		index("forum_threads_slug_idx").on(table.slug),
		index("forum_threads_last_post_at_idx").on(table.last_post_at),
		index("forum_threads_pinned_idx").on(table.is_pinned),
		index("forum_threads_deleted_idx").on(table.is_deleted),

		// RLS Policies
		crudPolicy({
			role: anonymousRole,
			read: sql`${table.is_deleted} = false`, // anonymous can only read non-deleted threads
			modify: false,
		}),
		crudPolicy({
			role: authenticatedRole,
			read: true, // authenticated users can read all threads (including deleted for moderation)
			modify: sql`${authUid(table.author_id)} OR ${table.is_locked} = false`, // author can modify, or if not locked
		}),
	],
);

export const forumPosts = pgTable(
	"forum_post",
	{
		id: varchar("id", { length: 36 }).primaryKey().$defaultFn(createId),
		content: text("content").notNull(),

		// Foreign keys
		thread_id: varchar("thread_id", { length: 36 })
			.notNull()
			.references(() => forumThreads.id, { onDelete: "cascade" }),
		author_id: varchar("author_id", { length: 36 })
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),

		// Reply functionality
		parent_post_id: varchar("parent_post_id", { length: 36 }),

		// Post metadata
		is_deleted: boolean("is_deleted").default(false).notNull(),
		is_edited: boolean("is_edited").default(false).notNull(),
		edited_at: timestamp("edited_at", { withTimezone: true }),
		edited_by: varchar("edited_by", { length: 36 }),

		created_at: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
		updated_at: timestamp("updated_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(table) => [
		index("forum_posts_thread_id_idx").on(table.thread_id),
		index("forum_posts_author_id_idx").on(table.author_id),
		index("forum_posts_parent_post_id_idx").on(table.parent_post_id),
		index("forum_posts_created_at_idx").on(table.created_at),
		index("forum_posts_deleted_idx").on(table.is_deleted),

		crudPolicy({
			role: anonymousRole,
			read: sql`${table.is_deleted} = false`, // anonymous can only read non-deleted posts
			modify: false,
		}),
		crudPolicy({
			role: authenticatedRole,
			read: true,
			modify: authUid(table.author_id),
		}),
	],
);

export const usersRelations = relations(users, ({ many }) => ({
	ownedGroups: many(forumGroups),
	threads: many(forumThreads),
	posts: many(forumPosts),
	sessions: many(sessions),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id],
	}),
}));

export const forumGroupsRelations = relations(forumGroups, ({ one, many }) => ({
	owner: one(users, {
		fields: [forumGroups.owner],
		references: [users.id],
	}),
	threads: many(forumThreads),
}));

export const forumThreadsRelations = relations(
	forumThreads,
	({ one, many }) => ({
		group: one(forumGroups, {
			fields: [forumThreads.group_id],
			references: [forumGroups.id],
		}),
		author: one(users, {
			fields: [forumThreads.author_id],
			references: [users.id],
		}),
		posts: many(forumPosts),
		lastPost: one(forumPosts, {
			fields: [forumThreads.last_post_id],
			references: [forumPosts.id],
		}),
		lastPostAuthor: one(users, {
			fields: [forumThreads.last_post_author_id],
			references: [users.id],
		}),
	}),
);

export const forumPostsRelations = relations(forumPosts, ({ one, many }) => ({
	thread: one(forumThreads, {
		fields: [forumPosts.thread_id],
		references: [forumThreads.id],
	}),
	author: one(users, {
		fields: [forumPosts.author_id],
		references: [users.id],
	}),
	parentPost: one(forumPosts, {
		fields: [forumPosts.parent_post_id],
		references: [forumPosts.id],
		relationName: "replies",
	}),
	replies: many(forumPosts, {
		relationName: "replies",
	}),
	editor: one(users, {
		fields: [forumPosts.edited_by],
		references: [users.id],
	}),
}));

export const forumQueries = {
	async getActiveGroups(db: any) {
		return await db
			.select({
				id: forumGroups.id,
				name: forumGroups.name,
				description: forumGroups.description,
				slug: forumGroups.slug,
				created_at: forumGroups.created_at,
			})
			.from(forumGroups)
			.orderBy(forumGroups.sort_order, forumGroups.name);
	},

	// Get threads in a group with pagination (respects RLS)
	async getThreadsInGroup(db: any, groupId: string, page = 1, limit = 20) {
		const offset = (page - 1) * limit;

		return await db
			.select({
				id: forumThreads.id,
				title: forumThreads.title,
				slug: forumThreads.slug,
				is_pinned: forumThreads.is_pinned,
				is_locked: forumThreads.is_locked,
				post_count: forumThreads.post_count,
				view_count: forumThreads.view_count,
				last_post_at: forumThreads.last_post_at,
				created_at: forumThreads.created_at,
			})
			.from(forumThreads)
			.where(eq(forumThreads.group_id, groupId))
			.orderBy(desc(forumThreads.is_pinned), desc(forumThreads.last_post_at))
			.limit(limit)
			.offset(offset);
	},

	// Get posts in a thread with pagination (respects RLS)
	async getPostsInThread(db: any, threadId: string, page = 1, limit = 20) {
		const offset = (page - 1) * limit;

		return await db
			.select({
				id: forumPosts.id,
				content: forumPosts.content,
				created_at: forumPosts.created_at,
				is_edited: forumPosts.is_edited,
				edited_at: forumPosts.edited_at,
				parent_post_id: forumPosts.parent_post_id,
			})
			.from(forumPosts)
			.where(eq(forumPosts.thread_id, threadId))
			.orderBy(forumPosts.created_at)
			.limit(limit)
			.offset(offset);
	},

	// Create a new thread (requires authentication via RLS)
	async createThread(
		db: any,
		data: {
			title: string;
			content: string;
			group_id: string;
			author_id: string;
			slug: string;
		},
	) {
		return await db.transaction(async (tx: any) => {
			// Create the thread (RLS ensures author_id matches authenticated user)
			const [thread] = await tx
				.insert(forumThreads)
				.values({
					title: data.title,
					content: data.content,
					group_id: data.group_id,
					author_id: data.author_id,
					slug: data.slug,
				})
				.returning();

			// Create the first post
			const [firstPost] = await tx
				.insert(forumPosts)
				.values({
					content: data.content,
					thread_id: thread.id,
					author_id: data.author_id,
				})
				.returning();

			// Update thread with first post info
			await tx
				.update(forumThreads)
				.set({
					last_post_id: firstPost.id,
					last_post_at: firstPost.created_at,
					last_post_author_id: firstPost.author_id,
					post_count: 1,
				})
				.where(eq(forumThreads.id, thread.id));

			return thread;
		});
	},

	// Add a post to a thread (requires authentication via RLS)
	async createPost(
		db: any,
		data: {
			content: string;
			thread_id: string;
			author_id: string;
			parent_post_id?: string;
		},
	) {
		return await db.transaction(async (tx: any) => {
			// Create the post (RLS ensures author_id matches authenticated user)
			const [post] = await tx.insert(forumPosts).values(data).returning();

			// Update thread metadata
			await tx
				.update(forumThreads)
				.set({
					last_post_id: post.id,
					last_post_at: post.created_at,
					last_post_author_id: post.author_id,
					post_count: sql`${forumThreads.post_count} + 1`,
				})
				.where(eq(forumThreads.id, data.thread_id));

			return post;
		});
	},
};
