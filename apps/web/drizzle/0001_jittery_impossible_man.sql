ALTER TABLE "users" ADD COLUMN "email" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "auth_id" varchar(255) NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "auth_id_unique" ON "users" ("auth_id");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "email_unique" UNIQUE("email");