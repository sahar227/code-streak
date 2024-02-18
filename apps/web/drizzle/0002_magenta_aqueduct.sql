CREATE TABLE IF NOT EXISTS "github_profiles" (
	"user_id" integer PRIMARY KEY NOT NULL,
	"github_user_id" varchar(255) NOT NULL,
	"repos_url" varchar(255),
	CONSTRAINT "github_user_id_unique" UNIQUE("github_user_id"),
	CONSTRAINT "repos_url_unique" UNIQUE("repos_url")
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "userName" varchar(255);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "github_profiles" ADD CONSTRAINT "github_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
