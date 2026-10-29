# Coaching Institute Website & Integrated Management ERP

A complete, production-ready Coaching Institute Website and full-lifecycle Institute Management ERP built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Prisma ORM**, and **Razorpay Server-Verified Payments**.

---

## 1. Quick Start & Setup Instructions

### Prerequisites
- Node.js `v18+` (tested with `v24.16.0`)
- npm `v9+`

### Setup & Launch
```bash
npm install
npm run db:setup
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 2. Bootstrap Administrator Account

The database is initialized in a clean production state with zero sample/dummy records. Log in to the 18-module Admin ERP Dashboard to configure your institute details, create courses, batches, and faculty accounts:

| Role | Portal Route | Email | Password |
|---|---|---|---|
| **Super Administrator** | `/admin` | `admin@institute.edu.in` | `Admin@123` |

---

## 3. Environment Variables (`.env.example`)

Copy `.env.example` to `.env`:
```env
# Database Connection
# Local SQLite (Zero-Config Development):
DATABASE_URL="file:./dev.db"
# Production PostgreSQL (use with prisma/schema.postgres.prisma):
# DATABASE_URL="postgresql://postgres:password@localhost:5432/institute_erp?schema=public"

# JWT & Session Cookie Security
JWT_SECRET="replace-with-at-least-32-char-cryptographic-secret"
SESSION_COOKIE_NAME="vv_erp_session"

# Razorpay Payment Gateway (Server-Verified Orders & Idempotent Webhooks)
RAZORPAY_KEY_ID="rzp_test_your_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
RAZORPAY_WEBHOOK_SECRET="your_razorpay_webhook_secret"
```

---

## 4. Database Migrations & PostgreSQL Production Deployment

1. **Switch to PostgreSQL Schema**:
   ```bash
   cp prisma/schema.postgres.prisma prisma/schema.prisma
   ```
2. **Set `DATABASE_URL` in `.env`** to your managed PostgreSQL instance (e.g., Supabase, Neon, AWS RDS, Railway).
3. **Run Prisma Migrations**:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```
4. **Build & Start Production Server**:
   ```bash
   npm run build
   npm run start
   ```
5. **Configure Razorpay Webhook**:
   Point your Razorpay Dashboard webhook URL to `https://your-domain.com/api/fees/razorpay/webhook` with event `payment.captured` and secret `RAZORPAY_WEBHOOK_SECRET`.
