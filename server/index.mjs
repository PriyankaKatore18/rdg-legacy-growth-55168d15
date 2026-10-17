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

const idLevelPlan = [
  [100, 10000],
  [250, 25000],
  [500, 50000],
  [1000, 100000],
  [2500, 250000],
  [5000, 500000],
  [10000, 1000000],
  [25000, 2500000],
  [50000, 5000000],
  [100000, 10000000],
  [250000, 25000000],
  [500000, 50000000],
  [1000000, 100000000],
  [2500000, 250000000],
  [5000000, 500000000],
].map(([packageValue, networkValue], index) => ({
  level: index + 1,
  packageValue,
  networkValue,
}));

function getIdLevelProgress(value) {
  const totalIds = Math.max(0, Number(value) || 0);
  const completedLevel = Math.min(Math.floor(totalIds / 100), idLevelPlan.length);
  const current = completedLevel ? idLevelPlan[completedLevel - 1] : null;
  const next = idLevelPlan[completedLevel] || null;
  const remainingIds = next ? Math.max(next.level * 100 - totalIds, 0) : 0;
  return {
    totalIds,
    completedLevel,
    currentPackageValue: current?.packageValue || 0,
    currentNetworkValue: current?.networkValue || 0,
    nextLevel: next?.level || null,
    nextPackageValue: next?.packageValue || null,
    remainingIds,
    levelPassed: completedLevel > 0,
    message: completedLevel
      ? `Level ${completedLevel} passed — 100 IDs completed. Discount/benefit eligibility for the ₹${current.packageValue.toLocaleString("en-IN")} ID package is unlocked.`
      : `Complete ${remainingIds || 100} paid IDs to pass Level 1 and unlock the first ID package benefit.`,
  };
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
const downloadSchema = z.object({
  title: z.string().trim().min(2).max(255),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(190)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().max(2000).optional().nullable(),
  fileType: z.string().trim().max(40).optional().nullable(),
  status: z.enum(["draft", "published"]),
  sortOrder: z.coerce.number().int().min(0).default(0),
});
const eventSchema = z.object({
  title: z.string().trim().min(2).max(255),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(190)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().max(2000).optional().nullable(),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  city: z.string().trim().min(1).max(120),
  eventType: z.string().trim().min(1).max(120),
  seats: z.coerce.number().int().min(0).default(0),
  registrationUrl: z.string().max(500).optional().nullable(),
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
const distributorSchema = z.object({
  distributorCode: z.string().trim().min(1).max(80),
  name: z.string().trim().min(2).max(160),
  email: z.string().email().max(190).optional().nullable().or(z.literal("")),
  phone: z.string().max(40).optional().nullable(),
  city: z.string().max(120).optional().nullable(),
  sponsorCode: z.string().max(80).optional().nullable(),
  status: z.enum(["active", "inactive", "blocked"]).default("active"),
  notes: z.string().max(5000).optional().nullable(),
});
const transactionSchema = z.object({
  distributorId: z.coerce.number().int().positive(),
  transactionType: z.enum(["id_purchase", "payment", "income", "refund", "adjustment"]),
  referenceNo: z.string().max(120).optional().nullable(),
  idCount: z.coerce.number().int().min(0).default(0),
  packageLevel: z.coerce.number().int().min(0).optional().nullable(),
  packageValue: z.coerce.number().min(0).optional().nullable(),
  amount: z.coerce.number().min(0),
  paymentMethod: z.string().max(60).optional().nullable(),
  paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]).default("pending"),
  transactionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  notes: z.string().max(5000).optional().nullable(),
});
const gallerySchema = z.object({
  title: z.string().trim().min(2).max(255),
  tag: z.string().trim().min(1).max(120),
  imageUrl: z.string().trim().min(1).max(500),
  altText: z.string().max(255).optional().nullable(),
  status: z.enum(["draft", "published"]),
  sortOrder: z.coerce.number().int().min(0).default(0),
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
    const [
      [[pageCounts]],
      [[productCounts]],
      [[blogCounts]],
      [[enquiryCounts]],
      [[distributorCounts]],
      [[transactionCounts]],
      [distributorLevelRows],
    ] = await Promise.all([
      query(
        "SELECT COUNT(*) AS total, SUM(status = 'published') AS published, SUM(status = 'draft') AS drafts FROM pages",
      ),
      query("SELECT COUNT(*) AS total FROM products WHERE status = 'published'"),
      query("SELECT COUNT(*) AS total FROM blog_posts WHERE status = 'published'"),
      query("SELECT COUNT(*) AS total, SUM(status = 'new') AS unread FROM contact_enquiries"),
      query("SELECT COUNT(*) AS total FROM distributors"),
      query(
        `SELECT
             COALESCE(SUM(CASE WHEN transaction_type = 'id_purchase' AND payment_status = 'paid' THEN id_count ELSE 0 END), 0) AS totalIds,
             COALESCE(SUM(CASE WHEN transaction_type IN ('payment', 'id_purchase') AND payment_status = 'paid' THEN amount ELSE 0 END), 0) AS totalPaidAmount,
             COALESCE(SUM(CASE WHEN payment_status = 'pending' THEN amount ELSE 0 END), 0) AS pendingPayments,
             COALESCE(SUM(CASE WHEN transaction_type = 'income' AND payment_status = 'paid' THEN amount ELSE 0 END), 0) AS totalIncome
           FROM distributor_transactions`,
      ),
      query(
        `SELECT d.id, d.distributor_code AS distributorCode, d.name, d.created_at,
           COALESCE(SUM(CASE WHEN t.transaction_type = 'id_purchase' AND t.payment_status = 'paid' THEN t.id_count ELSE 0 END), 0) AS totalIds
         FROM distributors d
         LEFT JOIN distributor_transactions t ON t.distributor_id = d.id
         GROUP BY d.id, d.distributor_code, d.name, d.created_at
         ORDER BY totalIds DESC, d.created_at DESC`,
      ),
    ]);
    const [recent] = await query(
      "SELECT id, action, entity_type AS entityType, entity_id AS entityId, created_at AS createdAt FROM activity_logs ORDER BY created_at DESC LIMIT 8",
    );
    const levelProgress = distributorLevelRows.map((item) => ({
      distributorId: item.id,
      distributorCode: item.distributorCode,
      name: item.name,
      ...getIdLevelProgress(item.totalIds),
    }));
    return ok(res, {
      metrics: {
        pages: Number(pageCounts.total || 0),
        publishedPages: Number(pageCounts.published || 0),
        draftPages: Number(pageCounts.drafts || 0),
        products: Number(productCounts.total || 0),
        blogPosts: Number(blogCounts.total || 0),
        enquiries: Number(enquiryCounts.total || 0),
        unreadEnquiries: Number(enquiryCounts.unread || 0),
        distributors: Number(distributorCounts.total || 0),
        totalIds: Number(transactionCounts.totalIds || 0),
        totalPaidAmount: Number(transactionCounts.totalPaidAmount || 0),
        pendingPayments: Number(transactionCounts.pendingPayments || 0),
        totalIncome: Number(transactionCounts.totalIncome || 0),
        passedLevels: levelProgress.reduce((sum, item) => sum + item.completedLevel, 0),
      },
      recent,
      levelProgress,
      levelNotifications: levelProgress.filter((item) => item.levelPassed).slice(0, 8),
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

app.get(
  "/api/admin/distributors",
  requireAuth,
  asyncRoute(async (req, res) => {
    const search = String(req.query.search || "").trim();
    const params = [];
    const where = [];
    if (search) {
      where.push(
        "(d.distributor_code LIKE ? OR d.name LIKE ? OR d.phone LIKE ? OR d.email LIKE ?)",
      );
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }
    const [rows] = await query(
      `SELECT d.*,
        COALESCE(SUM(CASE WHEN t.transaction_type = 'id_purchase' AND t.payment_status = 'paid' THEN t.id_count ELSE 0 END), 0) AS totalIds,
        COALESCE(SUM(CASE WHEN t.payment_status = 'paid' AND t.transaction_type IN ('payment', 'id_purchase') THEN t.amount ELSE 0 END), 0) AS totalPaid,
        COALESCE(SUM(CASE WHEN t.payment_status = 'pending' THEN t.amount ELSE 0 END), 0) AS totalPending,
        COALESCE(SUM(CASE WHEN t.transaction_type = 'income' AND t.payment_status = 'paid' THEN t.amount ELSE 0 END), 0) AS totalIncome,
        COUNT(t.id) AS transactionCount
       FROM distributors d
       LEFT JOIN distributor_transactions t ON t.distributor_id = d.id
       ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
       GROUP BY d.id
       ORDER BY d.created_at DESC`,
      params,
    );
    return ok(
      res,
      rows.map((item) => ({ ...item, ...getIdLevelProgress(item.totalIds) })),
    );
  }),
);

app.post(
  "/api/admin/distributors",
  requireAuth,
  allowRoles("super_admin", "enquiry_manager"),
  asyncRoute(async (req, res) => {
    const input = validate(distributorSchema, req.body, res);
    if (!input) return;
    try {
      const [result] = await query(
        "INSERT INTO distributors (distributor_code, name, email, phone, city, sponsor_code, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          input.distributorCode,
          input.name,
          input.email || null,
          input.phone || null,
          input.city || null,
          input.sponsorCode || null,
          input.status,
          input.notes || null,
        ],
      );
      await activity(req.user, "create", "distributor", result.insertId, { name: input.name });
      return ok(res, { id: result.insertId }, 201);
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY")
        return fail(res, "That distributor ID already exists.", 409);
      throw error;
    }
  }),
);

app.put(
  "/api/admin/distributors/:id",
  requireAuth,
  allowRoles("super_admin", "enquiry_manager"),
  asyncRoute(async (req, res) => {
    const id = idSchema.parse(req.params.id);
    const input = validate(distributorSchema, req.body, res);
    if (!input) return;
    try {
      const [result] = await query(
        "UPDATE distributors SET distributor_code = ?, name = ?, email = ?, phone = ?, city = ?, sponsor_code = ?, status = ?, notes = ? WHERE id = ?",
        [
          input.distributorCode,
          input.name,
          input.email || null,
          input.phone || null,
          input.city || null,
          input.sponsorCode || null,
          input.status,
          input.notes || null,
          id,
        ],
      );
      if (!result.affectedRows) return fail(res, "Distributor not found.", 404);
      await activity(req.user, "update", "distributor", id, { name: input.name });
      return ok(res, { id });
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY")
        return fail(res, "That distributor ID already exists.", 409);
      throw error;
    }
  }),
);

app.delete(
  "/api/admin/distributors/:id",
  requireAuth,
  allowRoles("super_admin"),
  asyncRoute(async (req, res) => {
    const id = idSchema.parse(req.params.id);
    const [result] = await query("DELETE FROM distributors WHERE id = ?", [id]);
    if (!result.affectedRows) return fail(res, "Distributor not found.", 404);
    await activity(req.user, "delete", "distributor", id);
    return ok(res, { id });
  }),
);

app.get(
  "/api/admin/distributors/:id/transactions",
  requireAuth,
  asyncRoute(async (req, res) => {
    const id = idSchema.parse(req.params.id);
    const [rows] = await query(
      `SELECT t.*, d.distributor_code AS distributorCode, d.name AS distributorName
       FROM distributor_transactions t
       INNER JOIN distributors d ON d.id = t.distributor_id
       WHERE t.distributor_id = ?
       ORDER BY t.transaction_date DESC, t.id DESC`,
      [id],
    );
    return ok(res, rows);
  }),
);

function transactionFilters(queryParams) {
  const where = [];
  const params = [];
  if (queryParams.distributorId) {
    where.push("t.distributor_id = ?");
    params.push(Number(queryParams.distributorId));
  }
  if (
    ["id_purchase", "payment", "income", "refund", "adjustment"].includes(
      queryParams.transactionType,
    )
  ) {
    where.push("t.transaction_type = ?");
    params.push(queryParams.transactionType);
  }
  if (["pending", "paid", "failed", "refunded"].includes(queryParams.paymentStatus)) {
    where.push("t.payment_status = ?");
    params.push(queryParams.paymentStatus);
  }
  return { where, params };
}

const transactionSelect = `SELECT t.*, d.distributor_code AS distributorCode, d.name AS distributorName
  FROM distributor_transactions t INNER JOIN distributors d ON d.id = t.distributor_id`;

app.get(
  "/api/admin/transactions",
  requireAuth,
  asyncRoute(async (req, res) => {
    const { where, params } = transactionFilters(req.query);
    const [rows] = await query(
      `${transactionSelect} ${where.length ? `WHERE ${where.join(" AND ")}` : ""} ORDER BY t.transaction_date DESC, t.id DESC`,
      params,
    );
    return ok(res, rows);
  }),
);

app.get(
  "/api/admin/transactions/export",
  requireAuth,
  asyncRoute(async (req, res) => {
    const { where, params } = transactionFilters(req.query);
    const [rows] = await query(
      `${transactionSelect} ${where.length ? `WHERE ${where.join(" AND ")}` : ""} ORDER BY t.transaction_date DESC, t.id DESC`,
      params,
    );
    const escapeCsv = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
    const header = [
      "Date",
      "Distributor ID",
      "Distributor",
      "Type",
      "Reference",
      "IDs",
      "Package level",
      "Package value",
      "Amount",
      "Payment method",
      "Payment status",
      "Notes",
    ];
    const lines = rows.map((item) =>
      [
        item.transaction_date,
        item.distributorCode,
        item.distributorName,
        item.transaction_type,
        item.reference_no,
        item.id_count,
        item.package_level,
        item.package_value,
        item.amount,
        item.payment_method,
        item.payment_status,
        item.notes,
      ]
        .map(escapeCsv)
        .join(","),
    );
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", "attachment; filename=rdg-transactions.csv");
    return res.send([header.map(escapeCsv).join(","), ...lines].join("\n"));
  }),
);

app.post(
  "/api/admin/transactions",
  requireAuth,
  allowRoles("super_admin", "enquiry_manager"),
  asyncRoute(async (req, res) => {
    const input = validate(transactionSchema, req.body, res);
    if (!input) return;
    const [[distributor]] = await query("SELECT id FROM distributors WHERE id = ? LIMIT 1", [
      input.distributorId,
    ]);
    if (!distributor) return fail(res, "Select a valid distributor.", 422);
    const [result] = await query(
      `INSERT INTO distributor_transactions
       (distributor_id, transaction_type, reference_no, id_count, package_level, package_value, amount, payment_method, payment_status, transaction_date, notes, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        input.distributorId,
        input.transactionType,
        input.referenceNo || null,
        input.idCount,
        input.packageLevel || null,
        input.packageValue ?? null,
        input.amount,
        input.paymentMethod || null,
        input.paymentStatus,
        input.transactionDate,
        input.notes || null,
        req.user.id,
      ],
    );
    await activity(req.user, "create", "transaction", result.insertId, {
      distributorId: input.distributorId,
      amount: input.amount,
      type: input.transactionType,
    });
    return ok(res, { id: result.insertId }, 201);
  }),
);

app.put(
  "/api/admin/transactions/:id",
  requireAuth,
  allowRoles("super_admin", "enquiry_manager"),
  asyncRoute(async (req, res) => {
    const id = idSchema.parse(req.params.id);
    const input = validate(transactionSchema, req.body, res);
    if (!input) return;
    const [[distributor]] = await query("SELECT id FROM distributors WHERE id = ? LIMIT 1", [
      input.distributorId,
    ]);
    if (!distributor) return fail(res, "Select a valid distributor.", 422);
    const [result] = await query(
      `UPDATE distributor_transactions SET distributor_id = ?, transaction_type = ?, reference_no = ?, id_count = ?, package_level = ?, package_value = ?, amount = ?, payment_method = ?, payment_status = ?, transaction_date = ?, notes = ? WHERE id = ?`,
      [
        input.distributorId,
        input.transactionType,
        input.referenceNo || null,
        input.idCount,
        input.packageLevel || null,
        input.packageValue ?? null,
        input.amount,
        input.paymentMethod || null,
        input.paymentStatus,
        input.transactionDate,
        input.notes || null,
        id,
      ],
    );
    if (!result.affectedRows) return fail(res, "Transaction not found.", 404);
    await activity(req.user, "update", "transaction", id, {
      distributorId: input.distributorId,
      amount: input.amount,
    });
    return ok(res, { id });
  }),
);

app.delete(
  "/api/admin/transactions/:id",
  requireAuth,
  allowRoles("super_admin"),
  asyncRoute(async (req, res) => {
    const id = idSchema.parse(req.params.id);
    const [result] = await query("DELETE FROM distributor_transactions WHERE id = ?", [id]);
    if (!result.affectedRows) return fail(res, "Transaction not found.", 404);
    await activity(req.user, "delete", "transaction", id);
    return ok(res, { id });
  }),
);

app.get(
  "/api/admin/gallery",
  requireAuth,
  asyncRoute(async (_req, res) => {
    const [rows] = await query(
      "SELECT id, title, tag, image_url AS imageUrl, alt_text AS altText, status, sort_order AS sortOrder, created_at AS createdAt, updated_at AS updatedAt FROM gallery_items ORDER BY sort_order ASC, created_at DESC",
    );
    return ok(res, rows);
  }),
);

app.post(
  "/api/admin/gallery",
  requireAuth,
  allowRoles("super_admin", "content_editor"),
  asyncRoute(async (req, res) => {
    const input = validate(gallerySchema, req.body, res);
    if (!input) return;
    const [result] = await query(
      "INSERT INTO gallery_items (title, tag, image_url, alt_text, status, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
      [
        input.title,
        input.tag,
        input.imageUrl,
        input.altText || null,
        input.status,
        input.sortOrder,
      ],
    );
    await activity(req.user, "create", "gallery_item", result.insertId, { title: input.title });
    return ok(res, { id: result.insertId }, 201);
  }),
);

app.put(
  "/api/admin/gallery/:id",
  requireAuth,
  allowRoles("super_admin", "content_editor"),
  asyncRoute(async (req, res) => {
    const id = idSchema.parse(req.params.id);
    const input = validate(gallerySchema, req.body, res);
    if (!input) return;
    const [result] = await query(
      "UPDATE gallery_items SET title = ?, tag = ?, image_url = ?, alt_text = ?, status = ?, sort_order = ? WHERE id = ?",
      [
        input.title,
        input.tag,
        input.imageUrl,
        input.altText || null,
        input.status,
        input.sortOrder,
        id,
      ],
    );
    if (!result.affectedRows) return fail(res, "Gallery item not found.", 404);
    await activity(req.user, "update", "gallery_item", id, { title: input.title });
    return ok(res, { id });
  }),
);

app.delete(
  "/api/admin/gallery/:id",
  requireAuth,
  allowRoles("super_admin", "content_editor"),
  asyncRoute(async (req, res) => {
    const id = idSchema.parse(req.params.id);
    const [result] = await query("DELETE FROM gallery_items WHERE id = ?", [id]);
    if (!result.affectedRows) return fail(res, "Gallery item not found.", 404);
    await activity(req.user, "delete", "gallery_item", id);
    return ok(res, { id });
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
  "/api/admin/events",
  requireAuth,
  asyncRoute(async (_req, res) => {
    const [rows] = await query(
      "SELECT id, slug, title, description, DATE_FORMAT(event_date, '%Y-%m-%d') AS eventDate, city, event_type AS eventType, seats, registration_url AS registrationUrl, status, sort_order AS sortOrder, created_at AS createdAt, updated_at AS updatedAt FROM events ORDER BY sort_order ASC, event_date ASC, created_at DESC",
    );
    return ok(res, rows);
  }),
);

app.post(
  "/api/admin/events",
  requireAuth,
  allowRoles("super_admin", "content_editor"),
  asyncRoute(async (req, res) => {
    const input = validate(eventSchema, req.body, res);
    if (!input) return;
    try {
      const [result] = await query(
        "INSERT INTO events (slug, title, description, event_date, city, event_type, seats, registration_url, status, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          input.slug,
          input.title,
          input.description || null,
          input.eventDate,
          input.city,
          input.eventType,
          input.seats,
          input.registrationUrl || null,
          input.status,
          input.sortOrder,
        ],
      );
      await activity(req.user, "create", "event", result.insertId, { title: input.title });
      return ok(res, { id: result.insertId }, 201);
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") return fail(res, "That event slug already exists.", 409);
      throw error;
    }
  }),
);

app.put(
  "/api/admin/events/:id",
  requireAuth,
  allowRoles("super_admin", "content_editor"),
  asyncRoute(async (req, res) => {
    const id = idSchema.parse(req.params.id);
    const input = validate(eventSchema, req.body, res);
    if (!input) return;
    try {
      const [result] = await query(
        "UPDATE events SET slug = ?, title = ?, description = ?, event_date = ?, city = ?, event_type = ?, seats = ?, registration_url = ?, status = ?, sort_order = ? WHERE id = ?",
        [
          input.slug,
          input.title,
          input.description || null,
          input.eventDate,
          input.city,
          input.eventType,
          input.seats,
          input.registrationUrl || null,
          input.status,
          input.sortOrder,
          id,
        ],
      );
      if (!result.affectedRows) return fail(res, "Event not found.", 404);
      await activity(req.user, "update", "event", id, { title: input.title });
      return ok(res, { id });
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") return fail(res, "That event slug already exists.", 409);
      throw error;
    }
  }),
);

app.delete(
  "/api/admin/events/:id",
  requireAuth,
  allowRoles("super_admin"),
  asyncRoute(async (req, res) => {
    const id = idSchema.parse(req.params.id);
    const [result] = await query("DELETE FROM events WHERE id = ?", [id]);
    if (!result.affectedRows) return fail(res, "Event not found.", 404);
    await activity(req.user, "delete", "event", id);
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
const downloadUpload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (_req, file, callback) =>
    callback(
      null,
      /^(application\/pdf|application\/zip|application\/x-7z-compressed|application\/msword|application\/vnd\.openxmlformats-officedocument\.(wordprocessingml\.document|spreadsheetml\.sheet|presentationml\.presentation)|application\/vnd\.ms-(excel|powerpoint)|image\/(jpeg|png|webp|gif))$/.test(
        file.mimetype,
      ),
    ),
});

function fileTypeFromName(name) {
  const extension = path
    .extname(name || "")
    .replace(/^\./, "")
    .toUpperCase();
  return extension || "FILE";
}

function fileSizeLabel(sizeBytes) {
  if (!sizeBytes) return null;
  const units = ["B", "KB", "MB", "GB"];
  let size = Number(sizeBytes);
  let unit = 0;
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024;
    unit += 1;
  }
  return `${size >= 10 || unit === 0 ? Math.round(size) : size.toFixed(1)} ${units[unit]}`;
}

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
  "/api/admin/downloads",
  requireAuth,
  asyncRoute(async (_req, res) => {
    const [rows] = await query(
      `SELECT id, slug, title, description, file_name AS fileName, file_url AS fileUrl, file_type AS fileType, mime_type AS mimeType, size_bytes AS sizeBytes, size_label AS sizeLabel, status, sort_order AS sortOrder, created_at AS createdAt, updated_at AS updatedAt FROM downloads ORDER BY sort_order ASC, created_at DESC`,
    );
    return ok(res, rows);
  }),
);

app.post(
  "/api/admin/downloads",
  requireAuth,
  allowRoles("super_admin", "content_editor"),
  downloadUpload.single("file"),
  asyncRoute(async (req, res) => {
    const input = validate(downloadSchema, req.body, res);
    if (!input) return;
    const file = req.file;
    const fileName = file?.filename || null;
    const fileUrl = file ? `/uploads/${file.filename}` : null;
    const fileType = input.fileType || (file ? fileTypeFromName(file.originalname) : "FILE");
    const [result] = await query(
      "INSERT INTO downloads (slug, title, description, file_name, file_url, file_type, mime_type, size_bytes, size_label, status, sort_order, uploaded_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        input.slug,
        input.title,
        input.description || null,
        fileName,
        fileUrl,
        fileType,
        file?.mimetype || null,
        file?.size || null,
        file ? fileSizeLabel(file.size) : null,
        input.status,
        input.sortOrder,
        req.user.id,
      ],
    );
    await activity(req.user, "create", "download", result.insertId, { title: input.title });
    return ok(res, { id: result.insertId }, 201);
  }),
);

app.put(
  "/api/admin/downloads/:id",
  requireAuth,
  allowRoles("super_admin", "content_editor"),
  downloadUpload.single("file"),
  asyncRoute(async (req, res) => {
    const id = idSchema.parse(req.params.id);
    const input = validate(downloadSchema, req.body, res);
    if (!input) return;
    const [rows] = await query(
      "SELECT file_name AS fileName, file_url AS fileUrl, file_type AS fileType, mime_type AS mimeType, size_bytes AS sizeBytes, size_label AS sizeLabel FROM downloads WHERE id = ? LIMIT 1",
      [id],
    );
    const existing = rows[0];
    if (!existing) return fail(res, "Download not found.", 404);

    const file = req.file;
    const fileName = file?.filename || existing.fileName;
    const fileUrl = file ? `/uploads/${file.filename}` : existing.fileUrl;
    const fileType =
      input.fileType || (file ? fileTypeFromName(file.originalname) : existing.fileType);
    const mimeType = file?.mimetype || existing.mimeType;
    const sizeBytes = file?.size || existing.sizeBytes;
    const sizeLabel = file ? fileSizeLabel(file.size) : existing.sizeLabel;

    await query(
      "UPDATE downloads SET slug = ?, title = ?, description = ?, file_name = ?, file_url = ?, file_type = ?, mime_type = ?, size_bytes = ?, size_label = ?, status = ?, sort_order = ?, uploaded_by = ? WHERE id = ?",
      [
        input.slug,
        input.title,
        input.description || null,
        fileName,
        fileUrl,
        fileType,
        mimeType,
        sizeBytes,
        sizeLabel,
        input.status,
        input.sortOrder,
        file ? req.user.id : null,
        id,
      ],
    );
    if (file && existing.fileName && existing.fileName !== file.filename)
      await fs.unlink(path.join(uploadDir, existing.fileName)).catch(() => undefined);
    await activity(req.user, "update", "download", id, { title: input.title });
    return ok(res, { id });
  }),
);

app.delete(
  "/api/admin/downloads/:id",
  requireAuth,
  allowRoles("super_admin"),
  asyncRoute(async (req, res) => {
    const id = idSchema.parse(req.params.id);
    const [rows] = await query("SELECT file_name AS fileName FROM downloads WHERE id = ? LIMIT 1", [
      id,
    ]);
    if (!rows[0]) return fail(res, "Download not found.", 404);
    await query("DELETE FROM downloads WHERE id = ?", [id]);
    if (rows[0].fileName)
      await fs.unlink(path.join(uploadDir, rows[0].fileName)).catch(() => undefined);
    await activity(req.user, "delete", "download", id);
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
  "/api/public/gallery",
  asyncRoute(async (_req, res) => {
    const [rows] = await query(
      "SELECT id, title, tag, image_url AS imageUrl, alt_text AS altText FROM gallery_items WHERE status = 'published' ORDER BY sort_order ASC, created_at DESC",
    );
    return ok(res, rows);
  }),
);

app.get(
  "/api/public/downloads",
  asyncRoute(async (_req, res) => {
    const [rows] = await query(
      "SELECT id, slug, title, description, file_name AS fileName, file_url AS fileUrl, file_type AS fileType, mime_type AS mimeType, size_bytes AS sizeBytes, size_label AS sizeLabel FROM downloads WHERE status = 'published' ORDER BY sort_order ASC, created_at DESC",
    );
    return ok(res, rows);
  }),
);

app.get(
  "/api/public/events",
  asyncRoute(async (_req, res) => {
    const [rows] = await query(
      "SELECT id, slug, title, description, DATE_FORMAT(event_date, '%Y-%m-%d') AS eventDate, city, event_type AS eventType, seats, registration_url AS registrationUrl FROM events WHERE status = 'published' ORDER BY sort_order ASC, event_date ASC, created_at DESC",
    );
    return ok(res, rows);
  }),
);

app.get(
  "/api/public/products",
  asyncRoute(async (_req, res) => {
    const [rows] = await query(
      "SELECT id, name, slug, category, subtitle, description, highlights, price, image_url AS imageUrl FROM products WHERE status = 'published' ORDER BY sort_order ASC, updated_at DESC",
    );
    return ok(
      res,
      rows.map((row) => ({ ...row, highlights: parseJson(row.highlights, []) })),
    );
  }),
);

app.get(
  "/api/public/blog-posts",
  asyncRoute(async (_req, res) => {
    const [rows] = await query(
      "SELECT id, title, slug, excerpt, category, COALESCE(DATE_FORMAT(published_at, '%Y-%m-%d'), DATE_FORMAT(created_at, '%Y-%m-%d')) AS date, 5 AS readMinutes FROM blog_posts WHERE status = 'published' ORDER BY COALESCE(published_at, created_at) DESC",
    );
    return ok(
      res,
      rows.map((row) => ({ ...row, read: row.readMinutes })),
    );
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
      "/api/admin/distributors",
      "/api/admin/distributors/:id/transactions",
      "/api/admin/transactions",
      "/api/admin/transactions/export",
      "/api/admin/gallery",
      "/api/admin/media",
      "/api/admin/downloads",
      "/api/admin/events",
      "/api/admin/settings",
      "/api/admin/activity-logs",
    ],
    public: [
      "POST /api/public/enquiries",
      "GET /api/public/gallery",
      "GET /api/public/downloads",
      "GET /api/public/events",
      "GET /api/public/products",
      "GET /api/public/blog-posts",
      "GET /api/public/site-config",
    ],
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
