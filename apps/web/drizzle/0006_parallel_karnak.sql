ALTER TABLE "github_profiles" ADD COLUMN "login" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "github_profiles" ADD CONSTRAINT "login_unique" UNIQUE("login");