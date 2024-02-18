import { table } from "console";
import {
  integer,
  pgTable,
  serial,
  unique,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 255 }).notNull(),
    authId: varchar("auth_id", { length: 255 }).notNull(), // e.g githubId
    name: varchar("name", { length: 255 }).notNull(),
    userName: varchar("userName", { length: 255 }),
  },
  (table) => ({
    uniqueEmail: unique("email_unique").on(table.email),
    uniqueAuthId: uniqueIndex("auth_id_unique").on(table.authId),
  })
);

export const githubProfiles = pgTable(
  "github_profiles",
  {
    userId: integer("user_id")
      .primaryKey()
      .references(() => users.id),
    githubUserId: varchar("github_user_id", { length: 255 }).notNull(),
    reposUrl: varchar("repos_url", { length: 255 }),
  },
  (table) => ({
    uniqueGithubUserId: unique("github_user_id_unique").on(table.githubUserId),
    uniqueReposUrl: unique("repos_url_unique").on(table.reposUrl),
  })
);
