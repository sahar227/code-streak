import { relations, sql } from "drizzle-orm";
import {
  int,
  mysqlEnum,
  mysqlTable,
  uniqueIndex,
  varchar,
  serial,
  text,
  datetime,
  date,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 256 }).notNull().unique(),
  userName: varchar("user_name", { length: 256 }).notNull().unique(),
  gitHubId: varchar("github_id", { length: 256 }).notNull().unique(),
  gitHubAccessToken: varchar("github_access_token", { length: 256 }),
});

export const userProfiles = mysqlTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: int("user_id").notNull().unique(),
  // totalXp: int("total_xp"),
  currentStreak: int("current_streak").default(0),
  lastConsumedEventDate: datetime("last_consumed_event_date").default(
    sql`CURRENT_TIMESTAMP`
  ),
});

export const userDailyProgress = mysqlTable(
  "user_daily_progress",
  {
    id: serial("id").primaryKey(),
    userId: int("user_id").notNull(),
    event: mysqlEnum("event", [
      "github_commit",
      "leetcode_submission",
    ]).notNull(),
    date: date("date").default(sql`(CURDATE())`),
    // xp: int("xp"),
    amount: int("amount").notNull(),
  },
  (userDailyProgress) => ({
    uniqueIndex: uniqueIndex("user_id_date_event_idx").on(
      userDailyProgress.userId,
      userDailyProgress.date,
      userDailyProgress.event
    ),
  })
);

export const userRelations = relations(users, ({ one }) => ({
  userProfile: one(userProfiles, {
    fields: [users.id],
    references: [userProfiles.userId],
  }),
}));

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, {
    fields: [userProfiles.userId],
    references: [users.id],
  }),
}));
