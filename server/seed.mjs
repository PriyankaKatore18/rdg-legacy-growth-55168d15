import "dotenv/config";
import bcrypt from "bcryptjs";
import { closePool, migrate, query } from "./db.mjs";

const pages = [
  ["Home", "home", "RDG Future Way home page", "published"],
  ["About Us", "about", "Company story, vision, mission and leadership", "published"],
  [
    "Anmol Ratan Juice",
    "products",
    "Signature herbal and mixed berry wellness product",
    "published",
  ],
  [
    "Business Opportunity",
    "business-opportunity",
    "Direct selling opportunity and journey",
    "published",
  ],
  ["Generation Plan", "generation-plan", "15-level income and reward structure", "published"],
  ["Income Calculator", "income-calculator", "Plan value and referral calculator", "published"],
  ["Contact", "contact", "Contact and enquiry page", "published"],
];

const settings = {
  company_name: "RDG Future Way Pvt. Ltd.",
  hero_title: "Pure Herbal Nutrition for a Healthier Tomorrow",
  hero_description:
    "Anmol Ratan Juice is a herbal and mixed berry wellness drink for Indian families who want a refreshing, fruit-forward addition to their everyday routine.",
  hero_cta_label: "Discover the Goodness",
  hero_cta_url: "/products",
  default_seo_title: "RDG Future Way Pvt. Ltd. | Anmol Ratan Juice",
  default_seo_description:
    "Discover Anmol Ratan Juice, RDG Future Way's herbal and mixed berry wellness product and business opportunity.",
};

export async function seedDatabase() {
  await migrate();
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password || password.length < 10) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_PASSWORD (minimum 10 characters) are required for the first admin user.",
    );
  }

  const [admins] = await query("SELECT id FROM admin_users WHERE email = ? LIMIT 1", [email]);
  if (!admins.length) {
    const passwordHash = await bcrypt.hash(password, 12);
    await query(
      "INSERT INTO admin_users (name, email, password_hash, role) VALUES (?, ?, ?, 'super_admin')",
      ["RDG Administrator", email, passwordHash],
    );
  }

  for (const [title, slug, description, status] of pages) {
    await query(
      "INSERT IGNORE INTO pages (title, slug, description, status, show_in_nav) VALUES (?, ?, ?, ?, ?)",
      [
        title,
        slug,
        description,
        status,
        ["home", "about", "products", "business-opportunity", "contact"].includes(slug) ? 1 : 0,
      ],
    );
  }

  for (const [key, value] of Object.entries(settings)) {
    await query(
      "INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)",
      [key, JSON.stringify(value)],
    );
  }
}

if (process.argv[1]?.endsWith("seed.mjs")) {
  try {
    await seedDatabase();
    console.log("RDG database seed completed.");
  } catch (error) {
    console.error("RDG database seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    await closePool();
  }
}
