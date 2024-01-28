import { createInsertSchema } from "drizzle-zod";
import { users } from "./schema";
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { credentials } from "../drizzle.config";

export type User = typeof users.$inferSelect; // return type when queried
export type NewUser = typeof users.$inferInsert; // insert type
export const insertUserSchema = createInsertSchema(users);

// init mysql2 Pool or Client
export const poolConnection = mysql.createPool(credentials);

export const db = drizzle(poolConnection);

export async function getUsers() {
  const result = await db.select().from(users);
  return result;
}
export async function insertUser(user: NewUser) {
  return await db.insert(users).values(user);
}
