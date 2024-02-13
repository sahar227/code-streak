import { StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { setupDb } from "./setup";
import { db } from "@/db";

describe("Integration tests example", () => {
  let container: StartedPostgreSqlContainer | undefined;
  beforeEach(async () => {
    await setupDb().then((c) => (container = c));
  });
  afterEach(async () => {
    await container?.stop();
  });
  it("runs tests", () => {
    expect(1).toBe(1);
  });

  it("runs db queries", async () => {
    const users = await db().query.users.findMany();
    expect(users.length).toBe(0);
  });
});
