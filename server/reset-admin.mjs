import "dotenv/config";
import bcrypt from "bcryptjs";
import { closePool, migrate, query } from "./db.mjs";

try {
  await migrate();
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password || password.length < 10)
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env first.");
  const hash = await bcrypt.hash(password, 12);
  await query(
    "INSERT INTO admin_users (name, email, password_hash, role) VALUES (?, ?, ?, 'super_admin') ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), active = 1, role = 'super_admin'",
    ["RDG Administrator", email, hash],
  );
  console.log("Admin credentials updated.");
} catch (error) {
  console.error("Admin reset failed:", error.message);
  process.exitCode = 1;
} finally {
  await closePool();
}
