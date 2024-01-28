import { migrate } from "drizzle-orm/mysql2/migrator";
import { db, poolConnection } from ".";

async function runMigrations() {
  // This will run migrations on the database, skipping the ones already applied
  await migrate(db, { migrationsFolder: "./drizzle" });
  // Don't forget to close the connection, otherwise the script will hang
  await poolConnection.end();
}

runMigrations();
