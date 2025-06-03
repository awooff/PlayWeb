CREATE ROLE "admin";--> statement-breakpoint
CREATE ROLE "user";--> statement-breakpoint
CREATE TABLE "forum_group" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"slug" varchar(100) NOT NULL,
	"owner_id" varchar(36) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "forum_group_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "forum_group" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "forum_post" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"thread_id" varchar(36) NOT NULL,
	"author_id" varchar(36) NOT NULL,
	"parent_post_id" varchar(36),
	"is_deleted" boolean DEFAULT false NOT NULL,
	"is_edited" boolean DEFAULT false NOT NULL,
	"edited_at" timestamp with time zone,
	"edited_by" varchar(36),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "forum_post" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "forum_thread" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"group_id" varchar(36) NOT NULL,
	"author_id" varchar(36) NOT NULL,
	"is_pinned" boolean DEFAULT false NOT NULL,
	"is_locked" boolean DEFAULT false NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"post_count" integer DEFAULT 0 NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"last_post_id" varchar(36),
	"last_post_at" timestamp with time zone,
	"last_post_author_id" varchar(36),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "forum_thread" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "username" SET DEFAULT auth.user_id();--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "forum_group" ADD CONSTRAINT "forum_group_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forum_post" ADD CONSTRAINT "forum_post_thread_id_forum_thread_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."forum_thread"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forum_post" ADD CONSTRAINT "forum_post_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forum_thread" ADD CONSTRAINT "forum_thread_group_id_forum_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."forum_group"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forum_thread" ADD CONSTRAINT "forum_thread_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "forum_groups_slug_idx" ON "forum_group" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "forum_groups_sort_order_idx" ON "forum_group" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX "forum_groups_owner_idx" ON "forum_group" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "forum_posts_thread_id_idx" ON "forum_post" USING btree ("thread_id");--> statement-breakpoint
CREATE INDEX "forum_posts_author_id_idx" ON "forum_post" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "forum_posts_parent_post_id_idx" ON "forum_post" USING btree ("parent_post_id");--> statement-breakpoint
CREATE INDEX "forum_posts_created_at_idx" ON "forum_post" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "forum_posts_deleted_idx" ON "forum_post" USING btree ("is_deleted");--> statement-breakpoint
CREATE INDEX "forum_threads_group_id_idx" ON "forum_thread" USING btree ("group_id");--> statement-breakpoint
CREATE INDEX "forum_threads_author_id_idx" ON "forum_thread" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "forum_threads_slug_idx" ON "forum_thread" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "forum_threads_last_post_at_idx" ON "forum_thread" USING btree ("last_post_at");--> statement-breakpoint
CREATE INDEX "forum_threads_pinned_idx" ON "forum_thread" USING btree ("is_pinned");--> statement-breakpoint
CREATE INDEX "forum_threads_deleted_idx" ON "forum_thread" USING btree ("is_deleted");--> statement-breakpoint
CREATE POLICY "crud-anonymous-policy-select" ON "forum_group" AS PERMISSIVE FOR SELECT TO "anonymous" USING ("forum_group"."is_active" = true);--> statement-breakpoint
CREATE POLICY "crud-anonymous-policy-insert" ON "forum_group" AS PERMISSIVE FOR INSERT TO "anonymous" WITH CHECK (false);--> statement-breakpoint
CREATE POLICY "crud-anonymous-policy-update" ON "forum_group" AS PERMISSIVE FOR UPDATE TO "anonymous" USING (false) WITH CHECK (false);--> statement-breakpoint
CREATE POLICY "crud-anonymous-policy-delete" ON "forum_group" AS PERMISSIVE FOR DELETE TO "anonymous" USING (false);--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "forum_group" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "forum_group" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.user_id() = "forum_group"."owner_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "forum_group" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.user_id() = "forum_group"."owner_id")) WITH CHECK ((select auth.user_id() = "forum_group"."owner_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "forum_group" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.user_id() = "forum_group"."owner_id"));--> statement-breakpoint
CREATE POLICY "crud-anonymous-policy-select" ON "forum_post" AS PERMISSIVE FOR SELECT TO "anonymous" USING ("forum_post"."is_deleted" = false);--> statement-breakpoint
CREATE POLICY "crud-anonymous-policy-insert" ON "forum_post" AS PERMISSIVE FOR INSERT TO "anonymous" WITH CHECK (false);--> statement-breakpoint
CREATE POLICY "crud-anonymous-policy-update" ON "forum_post" AS PERMISSIVE FOR UPDATE TO "anonymous" USING (false) WITH CHECK (false);--> statement-breakpoint
CREATE POLICY "crud-anonymous-policy-delete" ON "forum_post" AS PERMISSIVE FOR DELETE TO "anonymous" USING (false);--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "forum_post" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "forum_post" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.user_id() = "forum_post"."author_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "forum_post" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.user_id() = "forum_post"."author_id")) WITH CHECK ((select auth.user_id() = "forum_post"."author_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "forum_post" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.user_id() = "forum_post"."author_id"));--> statement-breakpoint
CREATE POLICY "crud-anonymous-policy-select" ON "forum_thread" AS PERMISSIVE FOR SELECT TO "anonymous" USING ("forum_thread"."is_deleted" = false);--> statement-breakpoint
CREATE POLICY "crud-anonymous-policy-insert" ON "forum_thread" AS PERMISSIVE FOR INSERT TO "anonymous" WITH CHECK (false);--> statement-breakpoint
CREATE POLICY "crud-anonymous-policy-update" ON "forum_thread" AS PERMISSIVE FOR UPDATE TO "anonymous" USING (false) WITH CHECK (false);--> statement-breakpoint
CREATE POLICY "crud-anonymous-policy-delete" ON "forum_thread" AS PERMISSIVE FOR DELETE TO "anonymous" USING (false);--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "forum_thread" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "forum_thread" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.user_id() = "forum_thread"."author_id") OR "forum_thread"."is_locked" = false);--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "forum_thread" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.user_id() = "forum_thread"."author_id") OR "forum_thread"."is_locked" = false) WITH CHECK ((select auth.user_id() = "forum_thread"."author_id") OR "forum_thread"."is_locked" = false);--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "forum_thread" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.user_id() = "forum_thread"."author_id") OR "forum_thread"."is_locked" = false);