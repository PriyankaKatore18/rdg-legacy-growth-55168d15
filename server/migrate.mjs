import { closePool, migrate } from "./db.mjs";

try {
  await migrate();
  console.log("RDG database migration completed.");
} catch (error) {
  console.error("RDG database migration failed:", error.message);
  process.exitCode = 1;
} finally {
  await closePool();
}
