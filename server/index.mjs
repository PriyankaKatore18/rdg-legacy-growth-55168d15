import "dotenv/config";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import jwt from "jsonwebtoken";
import multer from "multer";
import { z } from "zod";
import { closePool, migrate, query } from "./db.mjs";
import { seedDatabase } from "./seed.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.resolve(__dirname, "../public/uploads");
const port = Number(process.env.PORT || 8787);
const jwtSecret = process.env.JWT_SECRET;
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";

if (!jwtSecret || jwtSecret.length < 24)
  throw new Error("JWT_SECRET must be at least 24 characters.");
await fs.mkdir(uploadDir, { recursive: true });
await migrate();
await seedDatabase();

const app = express();
app.disable("x-powered-by");
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: corsOrigin.split(",").map((value) => value.trim()), credentials: true }));
app.use(express.json({ limit: "3mb" }));
app.use(cookieParser());
app.use("/uploads", express.static(uploadDir, { maxAge: "7d" }));

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "Too many login attempts. Try again later." },
});
const enquiryLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: "Too many enquiries. Please try again later." },
});

const asyncRoute = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);
const ok = (res, data, status = 200) => res.status(status).json({ success: true, data });
const fail = (res, message, status = 400, details) =>
  res.status(status).json({ success: false, error: message, details });

function parseJson(value, fallback = null) {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function validate(schema, value, res) {
  const result = schema.safeParse(value);
  if (!result.success) {
    fail(res, "Please correct the highlighted fields.", 422, result.error.flatten());
    return null;
  }
  return result.data;
}

function tokenFromRequest(req) {
  const header = req.headers.authorization;
  return req.cookies.rdg_admin_token || (header?.startsWith("Bearer ") ? header.slice(7) : null);
}

async function requireAuth(req, res, next) {
  const token = tokenFromRequest(req);
  if (!token) return fail(res, "Authentication required.", 401);
  try {
    const payload = jwt.verify(token, jwtSecret);
    const [rows] = await query(
      "SELECT id, name, email, role, active FROM admin_users WHERE id = ? LIMIT 1",
      [payload.sub],
    );
    if (!rows[0] || !rows[0].active) return fail(res, "Your account is inactive.", 403);
    req.user = rows[0];
    next();
  } catch {
    return fail(res, "Invalid or expired session.", 401);
  }
}

function allowRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role))
      return fail(res, "You do not have permission for this action.", 403);
    next();
  };
}

async function activity(user, action, entityType, entityId, metadata = {}) {
  await query(
    "INSERT INTO activity_logs (user_id, action, entity_type, entity_id, metadata) VALUES (?, ?, ?, ?, ?)",
    [user?.id || null, action, entityType, entityId || null, JSON.stringify(metadata)],
  );
}

const idSchema = z.coerce.number().int().positive();
const pageSchema = z.object({
  title: z.string().trim().min(2).max(255),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(190)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().max(2000).optional().nullable(),
  body: z.string().max(100000).optional().nullable(),
  status: z.enum(["draft", "published"]),
  seoTitle: z.string().max(255).optional().nullable(),
  seoDescription: z.string().max(320).optional().nullable(),
  showInNav: z.boolean().optional(),
});
const bannerSchema = z.object({
  title: z.string().trim().min(2).max(255),
  subtitle: z.string().max(255).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  ctaLabel: z.string().max(120).optional().nullable(),
  ctaUrl: z.string().max(500).optional().nullable(),
  imageUrl: z.string().max(500).optional().nullable(),
  mobileImageUrl: z.string().max(500).optional().nullable(),
  altText: z.string().max(255).optional().nullable(),
  sortOrder: z.coerce.number().int().min(0).default(0),
  active: z.boolean().default(true),
});
const productSchema = z.object({
  name: z.string().trim().min(2).max(255),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(190)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  category: z.string().max(120).optional().nullable(),
  subtitle: z.string().max(500).optional().nullable(),
  description: z.string().max(5000).optional().nullable(),
  highlights: z.array(z.string().max(255)).default([]),
  price: z.coerce.number().min(0).optional().nullable(),
  imageUrl: z.string().max(500).optional().nullable(),
  status: z.enum(["draft", "published"]),
  sortOrder: z.coerce.number().int().min(0).default(0),
});
const blogSchema = z.object({
  title: z.string().trim().min(2).max(255),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(190)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  excerpt: z.string().max(3000).optional().nullable(),
  body: z.string().max(100000).optional().nullable(),
  featuredImage: z.string().max(500).optional().nullable(),
  imageAlt: z.string().max(255).optional().nullable(),
  author: z.string().max(120).optional().nullable(),
  category: z.string().max(120).optional().nullable(),
  tags: z.array(z.string().max(80)).default([]),
  seoTitle: z.string().max(255).optional().nullable(),
  seoDescription: z.string().max(320).optional().nullable(),
  status: z.enum(["draft", "scheduled", "published"]),
  publishedAt: z.string().optional().nullable(),
});
const enquirySchema = z.object({
  type: z.enum(["contact", "distributor", "franchise", "other"]).default("contact"),
  name: z.string().trim().min(2).max(160),
  email: z.string().email().max(190).optional().nullable(),
  phone: z.string().max(40).optional().nullable(),
  city: z.string().max(120).optional().nullable(),
  businessType: z.string().max(160).optional().nullable(),
  investmentRange: z.string().max(120).optional().nullable(),
  message: z.string().max(5000).optional().nullable(),
});

app.get(
  "/api/health",
  asyncRoute(async (_req, res) => ok(res, { status: "ok", database: "connected" })),
);

app.post(
  "/api/auth/login",
  loginLimiter,
  asyncRoute(async (req, res) => {
    const parsed = z
      .object({ email: z.string().email(), password: z.string().min(1) })
      .safeParse(req.body);
    if (!parsed.success) return fail(res, "Email and password are required.", 422);
    const [rows] = await query("SELECT * FROM admin_users WHERE email = ? LIMIT 1", [
      parsed.data.email.toLowerCase(),
    ]);
    const user = rows[0];
    if (
      !user ||
      !user.active ||
      !(await bcrypt.compare(parsed.data.password, user.password_hash))
    ) {
      return fail(res, "Invalid email or password.", 401);
    }
    const token = jwt.sign({ sub: user.id, role: user.role, email: user.email }, jwtSecret, {
      expiresIn: "8h",
    });
    await query("UPDATE admin_users SET last_login = NOW() WHERE id = ?", [user.id]);
    await activity(user, "login", "auth", user.id);
    res.cookie("rdg_admin_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 8 * 60 * 60 * 1000,
    });
    return ok(res, { user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  }),
);

app.post(
  "/api/auth/logout",
  asyncRoute(async (req, res) => {
    res.clearCookie("rdg_admin_token");
    return ok(res, { loggedOut: true });
  }),
);

app.get(
  "/api/auth/me",
  requireAuth,
  asyncRoute(async (req, res) => ok(res, { user: req.user })),
);

app.get(
  "/api/admin/dashboard",
  requireAuth,
  asyncRoute(async (_req, res) => {
    const [[pageCounts]] = await Promise.all([
      query(
        "SELECT COUNT(*) AS total, SUM(status = 'published') AS published, SUM(status = 'draft') AS drafts FROM pages",
      ),
    ]);
    const [[productCounts]] = await Promise.all([
      query("SELECT COUNT(*) AS total FROM products WHERE status = 'published'"),
    ]);
    const [[blogCounts]] = await Promise.all([
      query("SELECT COUNT(*) AS total FROM blog_posts WHERE status = 'published'"),
    ]);
    const [[enquiryCounts]] = await Promise.all([
      query("SELECT COUNT(*) AS total, SUM(status = 'new') AS unread FROM contact_enquiries"),
    ]);
    const [recent] = await query(
      "SELECT id, action, entity_type AS entityType, entity_id AS entityId, created_at AS createdAt FROM activity_logs ORDER BY created_at DESC LIMIT 8",
    );
    return ok(res, {
      metrics: {
        pages: Number(pageCounts.total || 0),
        publishedPages: Number(pageCounts.published || 0),
        draftPages: Number(pageCounts.drafts || 0),
        products: Number(productCounts.total || 0),
        blogPosts: Number(blogCounts.total || 0),
        enquiries: Number(enquiryCounts.total || 0),
        unreadEnquiries: Number(enquiryCounts.unread || 0),
      },
      recent,
    });
  }),
);

app.get(
  "/api/admin/pages",
  requireAuth,
  asyncRoute(async (req, res) => {
    const q = String(req.query.q || "").trim();
    const status =
      req.query.status === "draft" || req.query.status === "published" ? req.query.status : null;
    const conditions = [];
    const params = [];
    if (q) {
      conditions.push("(title LIKE ? OR slug LIKE ?)");
      params.push(`%${q}%`, `%${q}%`);
    }
    if (status) {
      conditions.push("status = ?");
      params.push(status);
    }
    const [rows] = await query(
      `SELECT * FROM pages ${conditions.length ? `WHERE ${conditions.join(" AND ")}` : ""} ORDER BY updated_at DESC`,
      params,
    );
    return ok(res, rows);
  }),
);

app.post(
  "/api/admin/pages",
  requireAuth,
  allowRoles("super_admin", "content_editor"),
  asyncRoute(async (req, res) => {
    const input = validate(pageSchema, req.body, res);
    if (!input) return;
    try {
      const [result] = await query(
        "INSERT INTO pages (title, slug, description, body, status, seo_title, seo_description, show_in_nav) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          input.title,
          input.slug,
          input.description || null,
          input.body || null,
          input.status,
          input.seoTitle || null,
          input.seoDescription || null,
          input.showInNav ? 1 : 0,
        ],
      );
      await activity(req.user, "create", "page", result.insertId, { title: input.title });
      return ok(res, { id: result.insertId }, 201);
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") return fail(res, "That page slug already exists.", 409);
      throw error;
    }
  }),
);

app.put(
  "/api/admin/pages/:id",
  requireAuth,
  allowRoles("super_admin", "content_editor"),
  asyncRoute(async (req, res) => {
    const id = idSchema.parse(req.params.id);
    const input = validate(pageSchema, req.body, res);
    if (!input) return;
    try {
      const [result] = await query(
        "UPDATE pages SET title = ?, slug = ?, description = ?, body = ?, status = ?, seo_title = ?, seo_description = ?, show_in_nav = ? WHERE id = ?",
        [
          input.title,
          input.slug,
          input.description || null,
          input.body || null,
          input.status,
          input.seoTitle || null,
          input.seoDescription || null,
          input.showInNav ? 1 : 0,
          id,
        ],
      );
      if (!result.affectedRows) return fail(res, "Page not found.", 404);
      await activity(req.user, "update", "page", id, { title: input.title });
      return ok(res, { id });
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") return fail(res, "That page slug already exists.", 409);
      throw error;
    }
  }),
);

app.delete(
  "/api/admin/pages/:id",
  requireAuth,
  allowRoles("super_admin"),
  asyncRoute(async (req, res) => {
    const id = idSchema.parse(req.params.id);
    const [result] = await query("DELETE FROM pages WHERE id = ?", [id]);
    if (!result.affectedRows) return fail(res, "Page not found.", 404);
    await activity(req.user, "delete", "page", id);
    return ok(res, { id });
  }),
);

app.get(
  "/api/admin/banners",
  requireAuth,
  asyncRoute(async (_req, res) => {
    const [rows] = await query(
      "SELECT id, title, subtitle, description, cta_label AS ctaLabel, cta_url AS ctaUrl, image_url AS imageUrl, mobile_image_url AS mobileImageUrl, alt_text AS altText, sort_order AS sortOrder, active, starts_at AS startsAt, ends_at AS endsAt FROM banners ORDER BY sort_order ASC, created_at DESC",
    );
    return ok(res, rows);
  }),
);

app.post(
  "/api/admin/banners",
  requireAuth,
  allowRoles("super_admin", "content_editor"),
  asyncRoute(async (req, res) => {
    const input = validate(bannerSchema, req.body, res);
    if (!input) return;
    const [result] = await query(
      "INSERT INTO banners (title, subtitle, description, cta_label, cta_url, image_url, mobile_image_url, alt_text, sort_order, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        input.title,
        input.subtitle || null,
        input.description || null,
        input.ctaLabel || null,
        input.ctaUrl || null,
        input.imageUrl || null,
        input.mobileImageUrl || null,
        input.altText || null,
        input.sortOrder,
        input.active ? 1 : 0,
      ],
    );
    await activity(req.user, "create", "banner", result.insertId, { title: input.title });
    return ok(res, { id: result.insertId }, 201);
  }),
);

app.put(
  "/api/admin/banners/:id",
  requireAuth,
  allowRoles("super_admin", "content_editor"),
  asyncRoute(async (req, res) => {
    const id = idSchema.parse(req.params.id);
    const input = validate(bannerSchema, req.body, res);
    if (!input) return;
    const [result] = await query(
      "UPDATE banners SET title = ?, subtitle = ?, description = ?, cta_label = ?, cta_url = ?, image_url = ?, mobile_image_url = ?, alt_text = ?, sort_order = ?, active = ? WHERE id = ?",
      [
        input.title,
        input.subtitle || null,
        input.description || null,
        input.ctaLabel || null,
        input.ctaUrl || null,
        input.imageUrl || null,
        input.mobileImageUrl || null,
        input.altText || null,
        input.sortOrder,
        input.active ? 1 : 0,
        id,
      ],
    );
    if (!result.affectedRows) return fail(res, "Banner not found.", 404);
    await activity(req.user, "update", "banner", id, { title: input.title });
    return ok(res, { id });
  }),
);

app.delete(
  "/api/admin/banners/:id",
  requireAuth,
  allowRoles("super_admin"),
  asyncRoute(async (req, res) => {
    const id = idSchema.parse(req.params.id);
    const [result] = await query("DELETE FROM banners WHERE id = ?", [id]);
    if (!result.affectedRows) return fail(res, "Banner not found.", 404);
    await activity(req.user, "delete", "banner", id);
    return ok(res, { id });
  }),
);

app.get(
  "/api/admin/products",
  requireAuth,
  asyncRoute(async (_req, res) => {
    const [rows] = await query(
      "SELECT id, name, slug, category, subtitle, description, highlights, price, image_url AS imageUrl, status, sort_order AS sortOrder, updated_at AS updatedAt FROM products ORDER BY sort_order ASC, updated_at DESC",
    );
    return ok(
      res,
      rows.map((row) => ({ ...row, highlights: parseJson(row.highlights, []) })),
    );
  }),
);

app.post(
  "/api/admin/products",
  requireAuth,
  allowRoles("super_admin", "content_editor"),
  asyncRoute(async (req, res) => {
    const input = validate(productSchema, req.body, res);
    if (!input) return;
    try {
      const [result] = await query(
        "INSERT INTO products (name, slug, category, subtitle, description, highlights, price, image_url, status, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          input.name,
          input.slug,
          input.category || null,
          input.subtitle || null,
          input.description || null,
          JSON.stringify(input.highlights),
          input.price ?? null,
          input.imageUrl || null,
          input.status,
          input.sortOrder,
        ],
      );
      await activity(req.user, "create", "product", result.insertId, { name: input.name });
      return ok(res, { id: result.insertId }, 201);
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") return fail(res, "That product slug already exists.", 409);
      throw error;
    }
  }),
);

app.put(
  "/api/admin/products/:id",
  requireAuth,
  allowRoles("super_admin", "content_editor"),
  asyncRoute(async (req, res) => {
    const id = idSchema.parse(req.params.id);
    const input = validate(productSchema, req.body, res);
    if (!input) return;
    try {
      const [result] = await query(
        "UPDATE products SET name = ?, slug = ?, category = ?, subtitle = ?, description = ?, highlights = ?, price = ?, image_url = ?, status = ?, sort_order = ? WHERE id = ?",
        [
          input.name,
          input.slug,
          input.category || null,
          input.subtitle || null,
          input.description || null,
          JSON.stringify(input.highlights),
          input.price ?? null,
          input.imageUrl || null,
          input.status,
          input.sortOrder,
          id,
        ],
      );
      if (!result.affectedRows) return fail(res, "Product not found.", 404);
      await activity(req.user, "update", "product", id, { name: input.name });
      return ok(res, { id });
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") return fail(res, "That product slug already exists.", 409);
      throw error;
    }
  }),
);

app.delete(
  "/api/admin/products/:id",
  requireAuth,
  allowRoles("super_admin"),
  asyncRoute(async (req, res) => {
    const id = idSchema.parse(req.params.id);
    const [result] = await query("DELETE FROM products WHERE id = ?", [id]);
    if (!result.affectedRows) return fail(res, "Product not found.", 404);
    await activity(req.user, "delete", "product", id);
    return ok(res, { id });
  }),
);

app.get(
  "/api/admin/blog-posts",
  requireAuth,
  asyncRoute(async (_req, res) => {
    const [rows] = await query(
      "SELECT id, title, slug, excerpt, body, featured_image AS featuredImage, image_alt AS imageAlt, author, category, tags, seo_title AS seoTitle, seo_description AS seoDescription, status, published_at AS publishedAt, updated_at AS updatedAt FROM blog_posts ORDER BY updated_at DESC",
    );
    return ok(
      res,
      rows.map((row) => ({ ...row, tags: parseJson(row.tags, []) })),
    );
  }),
);

app.post(
  "/api/admin/blog-posts",
  requireAuth,
  allowRoles("super_admin", "content_editor"),
  asyncRoute(async (req, res) => {
    const input = validate(blogSchema, req.body, res);
    if (!input) return;
    try {
      const [result] = await query(
        "INSERT INTO blog_posts (title, slug, excerpt, body, featured_image, image_alt, author, category, tags, seo_title, seo_description, status, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          input.title,
          input.slug,
          input.excerpt || null,
          input.body || null,
          input.featuredImage || null,
          input.imageAlt || null,
          input.author || null,
          input.category || null,
          JSON.stringify(input.tags),
          input.seoTitle || null,
          input.seoDescription || null,
          input.status,
          input.publishedAt || null,
        ],
      );
      await activity(req.user, "create", "blog_post", result.insertId, { title: input.title });
      return ok(res, { id: result.insertId }, 201);
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") return fail(res, "That article slug already exists.", 409);
      throw error;
    }
  }),
);

app.put(
  "/api/admin/blog-posts/:id",
  requireAuth,
  allowRoles("super_admin", "content_editor"),
  asyncRoute(async (req, res) => {
    const id = idSchema.parse(req.params.id);
    const input = validate(blogSchema, req.body, res);
    if (!input) return;
    try {
      const [result] = await query(
        "UPDATE blog_posts SET title = ?, slug = ?, excerpt = ?, body = ?, featured_image = ?, image_alt = ?, author = ?, category = ?, tags = ?, seo_title = ?, seo_description = ?, status = ?, published_at = ? WHERE id = ?",
        [
          input.title,
          input.slug,
          input.excerpt || null,
          input.body || null,
          input.featuredImage || null,
          input.imageAlt || null,
          input.author || null,
          input.category || null,
          JSON.stringify(input.tags),
          input.seoTitle || null,
          input.seoDescription || null,
          input.status,
          input.publishedAt || null,
          id,
        ],
      );
      if (!result.affectedRows) return fail(res, "Article not found.", 404);
      await activity(req.user, "update", "blog_post", id, { title: input.title });
      return ok(res, { id });
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") return fail(res, "That article slug already exists.", 409);
      throw error;
    }
  }),
);

app.delete(
  "/api/admin/blog-posts/:id",
  requireAuth,
  allowRoles("super_admin"),
  asyncRoute(async (req, res) => {
    const id = idSchema.parse(req.params.id);
    const [result] = await query("DELETE FROM blog_posts WHERE id = ?", [id]);
    if (!result.affectedRows) return fail(res, "Article not found.", 404);
    await activity(req.user, "delete", "blog_post", id);
    return ok(res, { id });
  }),
);

app.get(
  "/api/admin/enquiries/export",
  requireAuth,
  allowRoles("super_admin", "enquiry_manager"),
  asyncRoute(async (_req, res) => {
    const [rows] = await query(
      "SELECT id, enquiry_type, name, email, phone, city, business_type, investment_range, message, status, created_at FROM contact_enquiries ORDER BY created_at DESC",
    );
    const headers = [
      "id",
      "type",
      "name",
      "email",
      "phone",
      "city",
      "business_type",
      "investment_range",
      "message",
      "status",
      "created_at",
    ];
    const csv = [
      headers.join(","),
      ...rows.map((row) => headers.map((key) => JSON.stringify(row[key] ?? "")).join(",")),
    ].join("\n");
    res.header("Content-Type", "text/csv");
    res.attachment("rdg-enquiries.csv");
    return res.send(csv);
  }),
);

app.get(
  "/api/admin/enquiries",
  requireAuth,
  asyncRoute(async (req, res) => {
    const status = ["new", "in_progress", "contacted", "closed"].includes(req.query.status)
      ? req.query.status
      : null;
    const [rows] = await query(
      `SELECT e.*, u.name AS assignedName FROM contact_enquiries e LEFT JOIN admin_users u ON u.id = e.assigned_to ${status ? "WHERE e.status = ?" : ""} ORDER BY e.created_at DESC`,
      status ? [status] : [],
    );
    return ok(res, rows);
  }),
);

app.put(
  "/api/admin/enquiries/:id",
  requireAuth,
  allowRoles("super_admin", "enquiry_manager"),
  asyncRoute(async (req, res) => {
    const id = idSchema.parse(req.params.id);
    const parsed = z
      .object({
        status: z.enum(["new", "in_progress", "contacted", "closed"]),
        internalNotes: z.string().max(5000).optional().nullable(),
      })
      .safeParse(req.body);
    if (!parsed.success) return fail(res, "Invalid enquiry update.", 422);
    const [result] = await query(
      "UPDATE contact_enquiries SET status = ?, internal_notes = ? WHERE id = ?",
      [parsed.data.status, parsed.data.internalNotes || null, id],
    );
    if (!result.affectedRows) return fail(res, "Enquiry not found.", 404);
    await activity(req.user, "update", "enquiry", id, { status: parsed.data.status });
    return ok(res, { id });
  }),
);

app.delete(
  "/api/admin/enquiries/:id",
  requireAuth,
  allowRoles("super_admin"),
  asyncRoute(async (req, res) => {
    const id = idSchema.parse(req.params.id);
    const [result] = await query("DELETE FROM contact_enquiries WHERE id = ?", [id]);
    if (!result.affectedRows) return fail(res, "Enquiry not found.", 404);
    await activity(req.user, "delete", "enquiry", id);
    return ok(res, { id });
  }),
);

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, uploadDir),
  filename: (_req, file, callback) =>
    callback(
      null,
      `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${path.extname(file.originalname).toLowerCase()}`,
    ),
});
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, callback) =>
    callback(null, /^(image\/(jpeg|png|webp|gif)|application\/pdf)$/.test(file.mimetype)),
});

app.get(
  "/api/admin/media",
  requireAuth,
  asyncRoute(async (req, res) => {
    const search = String(req.query.q || "").trim();
    const [rows] = await query(
      `SELECT id, filename, original_name AS originalName, mime_type AS mimeType, size_bytes AS sizeBytes, url, alt_text AS altText, created_at AS createdAt FROM media_assets ${search ? "WHERE original_name LIKE ?" : ""} ORDER BY created_at DESC`,
      search ? [`%${search}%`] : [],
    );
    return ok(res, rows);
  }),
);

app.post(
  "/api/admin/media",
  requireAuth,
  allowRoles("super_admin", "content_editor"),
  upload.single("file"),
  asyncRoute(async (req, res) => {
    if (!req.file) return fail(res, "Upload an image or PDF up to 8 MB.", 422);
    const altText = String(req.body.altText || "").slice(0, 255) || null;
    const url = `/uploads/${req.file.filename}`;
    const [result] = await query(
      "INSERT INTO media_assets (filename, original_name, mime_type, size_bytes, url, alt_text, uploaded_by) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        req.file.filename,
        req.file.originalname,
        req.file.mimetype,
        req.file.size,
        url,
        altText,
        req.user.id,
      ],
    );
    await activity(req.user, "upload", "media", result.insertId, {
      filename: req.file.originalname,
    });
    return ok(res, { id: result.insertId, url, filename: req.file.filename }, 201);
  }),
);

app.delete(
  "/api/admin/media/:id",
  requireAuth,
  allowRoles("super_admin"),
  asyncRoute(async (req, res) => {
    const id = idSchema.parse(req.params.id);
    const [rows] = await query("SELECT filename FROM media_assets WHERE id = ? LIMIT 1", [id]);
    if (!rows[0]) return fail(res, "Media asset not found.", 404);
    await query("DELETE FROM media_assets WHERE id = ?", [id]);
    await fs.unlink(path.join(uploadDir, rows[0].filename)).catch(() => undefined);
    await activity(req.user, "delete", "media", id);
    return ok(res, { id });
  }),
);

app.get(
  "/api/admin/settings",
  requireAuth,
  asyncRoute(async (_req, res) => {
    const [rows] = await query(
      "SELECT setting_key AS settingKey, setting_value AS settingValue, updated_at AS updatedAt FROM site_settings ORDER BY setting_key",
    );
    return ok(
      res,
      Object.fromEntries(
        rows.map((row) => [row.settingKey, parseJson(row.settingValue, row.settingValue)]),
      ),
    );
  }),
);

app.put(
  "/api/admin/settings",
  requireAuth,
  allowRoles("super_admin"),
  asyncRoute(async (req, res) => {
    const settings = req.body?.settings;
    if (!settings || typeof settings !== "object" || Array.isArray(settings))
      return fail(res, "Settings payload is invalid.", 422);
    for (const [key, value] of Object.entries(settings)) {
      if (!/^[a-z0-9_]{2,120}$/.test(key)) continue;
      await query(
        "INSERT INTO site_settings (setting_key, setting_value, updated_by) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), updated_by = VALUES(updated_by)",
        [key, JSON.stringify(String(value).slice(0, 5000)), req.user.id],
      );
    }
    await activity(req.user, "update", "settings", null, { keys: Object.keys(settings) });
    return ok(res, settings);
  }),
);

app.get(
  "/api/admin/activity-logs",
  requireAuth,
  allowRoles("super_admin"),
  asyncRoute(async (_req, res) => {
    const [rows] = await query(
      "SELECT a.id, a.action, a.entity_type AS entityType, a.entity_id AS entityId, a.metadata, a.created_at AS createdAt, u.name AS userName FROM activity_logs a LEFT JOIN admin_users u ON u.id = a.user_id ORDER BY a.created_at DESC LIMIT 100",
    );
    return ok(
      res,
      rows.map((row) => ({ ...row, metadata: parseJson(row.metadata, {}) })),
    );
  }),
);

app.post(
  "/api/public/enquiries",
  enquiryLimiter,
  asyncRoute(async (req, res) => {
    const input = validate(enquirySchema, req.body, res);
    if (!input) return;
    const [result] = await query(
      "INSERT INTO contact_enquiries (enquiry_type, name, email, phone, city, business_type, investment_range, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        input.type,
        input.name,
        input.email || null,
        input.phone || null,
        input.city || null,
        input.businessType || null,
        input.investmentRange || null,
        input.message || null,
      ],
    );
    return ok(res, { id: result.insertId, message: "Your enquiry has been received." }, 201);
  }),
);

app.get(
  "/api/public/site-config",
  asyncRoute(async (_req, res) => {
    const [settingsRows] = await query(
      "SELECT setting_key AS settingKey, setting_value AS settingValue FROM site_settings",
    );
    const [banners] = await query(
      "SELECT id, title, subtitle, description, cta_label AS ctaLabel, cta_url AS ctaUrl, image_url AS imageUrl, mobile_image_url AS mobileImageUrl, alt_text AS altText FROM banners WHERE active = 1 AND (starts_at IS NULL OR starts_at <= NOW()) AND (ends_at IS NULL OR ends_at >= NOW()) ORDER BY sort_order ASC",
    );
    return ok(res, {
      settings: Object.fromEntries(
        settingsRows.map((row) => [row.settingKey, parseJson(row.settingValue, row.settingValue)]),
      ),
      banners,
    });
  }),
);

app.get("/api/docs", (_req, res) =>
  ok(res, {
    auth: ["POST /api/auth/login", "POST /api/auth/logout", "GET /api/auth/me"],
    admin: [
      "/api/admin/dashboard",
      "/api/admin/pages",
      "/api/admin/banners",
      "/api/admin/products",
      "/api/admin/blog-posts",
      "/api/admin/enquiries",
      "/api/admin/media",
      "/api/admin/settings",
      "/api/admin/activity-logs",
    ],
    public: ["POST /api/public/enquiries", "GET /api/public/site-config"],
  }),
);

app.use((error, _req, res, _next) => {
  if (error instanceof multer.MulterError || error?.code === "LIMIT_FILE_SIZE")
    return fail(res, "File is too large. Maximum size is 8 MB.", 413);
  if (error?.code === "ER_DUP_ENTRY")
    return fail(res, "A record with that unique value already exists.", 409);
  console.error("API error:", error.message);
  return fail(res, "Something went wrong. Please try again.", 500);
});

const server = app.listen(port, () => {
  console.log(`RDG CMS API running on http://localhost:${port}`);
});

const shutdown = async () => {
  server.close();
  await closePool();
  process.exit(0);
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
