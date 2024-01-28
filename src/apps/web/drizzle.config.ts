import type { Config } from "drizzle-kit";

export const credentials = {
  host: "localhost",
  user: "root",
  database: "test",
  password: "password",
};

export default {
  schema: "./db/schema.ts",
  out: "./drizzle",
  driver: "mysql2", // 'pg' | 'mysql2' | 'better-sqlite' | 'libsql' | 'turso'
  dbCredentials: credentials,
} satisfies Config;
