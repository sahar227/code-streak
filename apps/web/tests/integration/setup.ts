import { connect, migrateDB } from "@/db";
import { PostgreSqlContainer } from "@testcontainers/postgresql";

export async function setupDb() {
  const container = await new PostgreSqlContainer("postgres:14-alpine").start();
  const connectionString = `postgres://${container.getUsername()}:${container.getPassword()}@${container.getHost()}:${container.getPort()}/${container.getDatabase()}`;
  connect(connectionString);
  await migrateDB(connectionString);

  return container;
}
