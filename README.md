# PawMandu

Online pet supplies store for Kathmandu Valley — dog, cat, and fish products, delivered flat-rate, with payment coordinated manually over WhatsApp.

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4, React Router v7 |
| Frontend state | TanStack Query (server state), Zustand (UI state) |
| Frontend forms | React Hook Form + Zod |
| Backend | Node.js 22+, Express, TypeScript (ESM/NodeNext) |
| Database | MongoDB (Mongoose) |
| Auth | Clerk |
| Image storage | Cloudinary |
| Email | Nodemailer + Gmail SMTP |
| Security | Arcjet (shield, bot detection, rate limiting) + express-rate-limit (fallback layer), Helmet, strict CORS allowlist |
| Validation | express-validator |

## Features

**Customer** — browse by species/category, filter/search/sort, product detail with related items, cart with live stock/price revalidation, checkout with saved addresses, manual QR + WhatsApp payment, order tracking with independent order/payment status, self-service cancellation while an order is still "placed," order history with reorder, profile and address management.

**Admin** — dashboard (orders today, revenue today, pending verifications, low stock), order management with payment verification and validated status transitions, product management (create/edit/deactivate/delete with image upload), inventory quick-adjust.

## Project structure

```text
PawMandu/
├── backend/            # Express, Node.js (ESM), TypeScript, Mongoose
│   ├── src/
│   │   ├── config/     # Environment, DB, Cloudinary, Email configs
│   │   ├── controllers/# API route controllers
│   │   ├── middleware/ # Error, auth, validation middleware
│   │   ├── models/     # Mongoose schemas (User, Product, Category, Order, Cart)
│   │   ├── routes/     # Express router modules
│   │   ├── services/   # Email, Cloudinary services
│   │   ├── validators/ # Request validation schemas
│   │   └── server.ts   # Main app entry point
│   └── package.json
└── frontend/           # React 19, Vite, TypeScript, Tailwind CSS
    ├── src/
    │   ├── components/ # Reusable UI, Layout, Account, Product components
    │   ├── hooks/      # TanStack Query & custom hooks
    │   ├── pages/      # Shop, Order, Account, Admin pages
    │   └── services/   # Axios API client setup
    └── package.json
```

## API reference

| Method | Endpoint | Auth | Notes |
|---|---|---|---|
| GET | `/api/health` | Public | |
| POST | `/api/webhooks/clerk` | Svix signature | Excluded from Arcjet — server-to-server |
| GET / PATCH | `/api/users/me` | Signed-in | |
| GET | `/api/users/admin-check` | Admin | |
| GET/POST/PATCH/DELETE | `/api/addresses` | Signed-in, owner-scoped | |
| GET | `/api/categories` | Public | |
| GET | `/api/products` | Public | species, category, price range, search, sort, pagination |
| GET | `/api/products/:slug` | Public | |
| POST/PATCH/DELETE | `/api/products/:id` | Admin | |
| GET/POST/PATCH/DELETE | `/api/cart` | Signed-in | Price/stock always revalidated |
| POST | `/api/orders` | Signed-in | Idempotent, atomic stock decrement, rate-limited |
| GET | `/api/orders` | Signed-in, own orders only | |
| GET | `/api/orders/:id` | Signed-in, owner-scoped | |
| PATCH | `/api/orders/:id/cancel` | Signed-in, owner-scoped | Only while `"placed"` |
| GET | `/api/admin/orders` | Admin | |
| PATCH | `/api/admin/orders/:id/verify-payment` | Admin | |
| PATCH | `/api/admin/orders/:id/status` | Admin | Validated transitions only |
| GET | `/api/admin/products` | Admin | Includes inactive |
| GET | `/api/admin/dashboard/stats` | Admin | |
| POST/DELETE | `/api/admin/uploads/products` | Admin | Rate-limited |

## Local setup

Requires Node 22.21.0+ (`nvm use`).

```bash
# Backend
cd backend
npm install
cp .env.example .env
npm run seed:categories
npm run seed:products
npm run dev

# Frontend
cd frontend
npm install
cp .env.example .env
npm run dev
```

### Backend `.env.example`

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/pawmandu
CLIENT_URL=http://localhost:5173

CLERK_SECRET_KEY=
CLERK_PUBLISHABLE_KEY=
CLERK_WEBHOOK_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

GMAIL_USER=
GMAIL_APP_PASSWORD=

ARCJET_KEY=
```

### Frontend `.env.example`

```env
VITE_API_URL=http://localhost:3000/api
VITE_CLERK_PUBLISHABLE_KEY=
VITE_WHATSAPP_NUMBER=
```

## Deployment

- **Frontend:** Vercel (`vercel.json` handles client-side routing)
- **Backend:** Render (Node 22+ via `engines` in `package.json`; build: `npm install && npm run build`; start: `npm start`)
- **Database:** MongoDB Atlas, Network Access set to `0.0.0.0/0` for Render's non-static IPs
- **Order matters:** deploy backend → deploy frontend with the real backend URL → return to Render and set `CLIENT_URL` to the real frontend URL
- **Clerk:** requires a new webhook endpoint pointed at the production backend URL (the development one uses an ngrok tunnel that won't exist in production), and promotion to Clerk's Production instance for live keys
- **Gmail:** send one real test order immediately after deploying and check the account's security activity for a sign-in prompt from Render's server location

## Security

**Implemented:** Arcjet (shield WAF, bot detection allowing search engines, token-bucket rate limiting) layered with express-rate-limit as a fallback ceiling on general traffic, checkout, uploads, and webhooks; Helmet; strict CORS allowlist; environment validation at boot; Clerk-verified auth with server-side role checks; ownership-scoped queries on every customer resource; atomic stock decrement via MongoDB transactions (prevents overselling under concurrent checkout); idempotent order creation; webhook signature verification, excluded from bot detection as a legitimate server-to-server caller; whitelisted field updates on admin product mutations; file upload MIME/size validation; accessibility focus trapping, keyboard navigation, and ARIA modal dialog role management.

**Known, deliberately deferred:** upload validation checks declared MIME type, not actual file-content bytes. Rate limiting (both Arcjet and express-rate-limit) uses per-instance state, correct for Render's single free-tier instance, not multiple instances behind a load balancer. Arcjet fails open on its own service errors — a conscious availability-over-paranoia choice for a store this size, not universally the right default. No automated test suite. Deleting a Cloudinary asset directly from their dashboard (instead of through the admin UI) isn't detected by the app — a process rule, not a technical safeguard.

## Order, payment, and inventory behavior

- **Payment:** manual — QR code + WhatsApp confirmation, admin-verified. No payment gateway.
- **Order status:** `placed → processing → delivered`, or `cancelled` from either of the first two, server-enforced transitions.
- **Payment status:** `pending → verified`, independent of order status.
- **Cancellation:** customer self-cancel only while `"placed"`; admin from `"placed"` or `"processing"`. Either path atomically restores stock.
- **Inventory:** decremented atomically at checkout (not at add-to-cart), preventing two simultaneous buyers from both winning the last unit.
- **Refunds:** manual, via WhatsApp.

## Note for anyone else running this

You'll need your own accounts for Clerk, MongoDB Atlas, Cloudinary, Arcjet, and a Gmail account with an App Password — none of this project's credentials are included or transferable.