CREATE TABLE IF NOT EXISTS "user_statuses" (
	"user_id" integer PRIMARY KEY NOT NULL,
	"xp" integer DEFAULT 0 NOT NULL,
	"current_streak" integer DEFAULT 0 NOT NULL,
	"longest_streak" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_id_unique" ON "user_statuses" ("user_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_statuses" ADD CONSTRAINT "user_statuses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
