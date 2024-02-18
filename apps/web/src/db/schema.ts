import {
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
  },
  (table) => ({
    uniqueEmail: unique("email_unique").on(table.email),
    uniqueAuthId: uniqueIndex("auth_id_unique").on(table.authId),
  })
);
