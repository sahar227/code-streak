import { connectionString as configConnectionString } from "@/config";
import * as schema from "./schema";
import { drizzle } from "drizzle-orm/postgres-js";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

let _db: PostgresJsDatabase<typeof schema>;

export function connect(connectionString: string) {
  const queryClient = postgres(connectionString);
  _db = drizzle(queryClient, { schema });
}

export function db() {
  if (!_db) connect(configConnectionString);
  return _db;
}

export function migrateDB(connectionString: string) {
  const migrationClient = postgres(connectionString, { max: 1 });

  return migrate(drizzle(migrationClient), { migrationsFolder: "drizzle" });
}

export async function seed(connectionString: string) {
  connect(connectionString);

  // do seeding here!
}
