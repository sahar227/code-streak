import { table } from "console";
import { relations } from "drizzle-orm";
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

export const userStatuses = pgTable(
  "user_statuses",
  {
    userId: integer("user_id")
      .primaryKey()
      .references(() => users.id),
    xp: integer("xp").notNull().default(0),
    currentStreak: integer("current_streak").notNull().default(0),
    longestStreak: integer("longest_streak").notNull().default(0),
  },
  (table) => ({
    uniqueUserId: uniqueIndex("user_id_unique").on(table.userId),
  })
);

export const userRelations = relations(users, ({ one }) => ({
  githubProfile: one(githubProfiles, {
    fields: [users.authId],
    references: [githubProfiles.githubUserId],
  }),
  userStatus: one(userStatuses, {
    fields: [users.id],
    references: [userStatuses.userId],
  }),
}));
