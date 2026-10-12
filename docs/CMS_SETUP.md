# RDG CMS setup

The project now contains a real Express + MySQL CMS API alongside the existing Vite/React public website.

## Local requirements

- Node.js 20+
- MySQL 8+ running locally
- Database user with permission to create the `rdg` database

## First-time setup

1. Copy `.env.example` to `.env`.
2. Set the MySQL values in `.env`:

```env
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_DATABASE=rdg
MYSQL_USER=root
MYSQL_PASSWORD=your-local-password
```

3. Set a long `JWT_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` in `.env`.
4. Install dependencies:

```bash
npm install
```

5. Create the schema and seed the first administrator:

```bash
npm run db:migrate
npm run db:seed
```

6. Start the API and frontend in separate terminals:

```bash
npm run server
npm run dev
```

The API runs on `http://localhost:8787` and Vite proxies `/api` and `/uploads` to it.

## Admin access

- Login: `http://localhost:5173/admin/login`
- Dashboard: `http://localhost:5173/admin/dashboard`

The first admin account is created from `ADMIN_EMAIL` and `ADMIN_PASSWORD`. Change the password before production using `npm run admin:reset` after updating `.env`.

## Implemented CMS modules

- Secure cookie-based administrator login and logout
- Role checks for Super Admin, Content Editor, and Enquiry Manager
- Dashboard metrics backed by MySQL
- Website pages with draft/published state, navigation visibility and SEO fields
- Hero banner management
- Product management
- Blog / insights management
- Contact, distributor and franchise enquiry inbox
- CSV enquiry export
- Media library with image/PDF upload validation and safe deletion
- Global website settings
- Activity logs
- Public enquiry API with validation and rate limiting
- Public site configuration API for published banners/settings

## Security notes

- `.env` is ignored and must never be committed.
- Do not use the local `root` database account in production. Create a restricted MySQL user.
- Put the API behind HTTPS and set `NODE_ENV=production` so the admin cookie is Secure.
- Set `CORS_ORIGIN` to the real frontend origin before deployment.
- Uploaded media is stored under `public/uploads` for local development. Use persistent object storage for production deployments.
