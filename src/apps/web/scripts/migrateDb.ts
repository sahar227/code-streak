import { connectionString } from "../src/config";
import { migrateDB } from "../src/db";

migrateDB(connectionString).then(() => {
  console.log("Migration done");
  process.exit(0);
});
