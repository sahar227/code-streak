import { connectionString } from "../src/config";
import { seed } from "../src/db";

seed(connectionString).then(() => {
  console.log("Seed completed");
  process.exit(0);
});
