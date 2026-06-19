# Artisan Haven

**Handcrafted Art for Beautiful Living** — A premium artistic e-commerce platform.

## Tech Stack

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS v4, Framer Motion
- **Auth:** MongoDB + JWT sessions + magic link email
- **Database:** MongoDB Atlas
- **Payments:** Stripe (optional)
- **Deployment:** Vercel

## Quick Start (Local)

```bash
# Install dependencies
npm install

# Copy and fill environment variables
cp .env.example .env

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Default admin (seeded on first login)

| Email | Password |
|-------|----------|
| `vandan11patel@gmail.com` | Value of `ADMIN_PASSWORD` in `.env` |

## Deploy to Vercel

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for the full step-by-step guide.

**Quick steps:**
1. Create MongoDB Atlas cluster → copy `MONGODB_URI`
2. Push repo to GitHub
3. Import on [vercel.com/new](https://vercel.com/new)
4. Add env vars: `MONGODB_URI`, `AUTH_SECRET`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_APP_URL`
5. Deploy → visit `/api/health` to verify

## Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/shop` | Product listing |
| `/product/[slug]` | Product detail |
| `/cart` | Shopping cart |
| `/checkout` | Checkout |
| `/login` | Sign in (password or magic link) |
| `/signup` | Create account |
| `/dashboard/user` | User dashboard (wishlist, albums) |
| `/dashboard/artist` | Artist dashboard (products, sales) |
| `/dashboard/admin` | Admin dashboard (orders, profits, analytics) |
| `/api/health` | Deployment health check |

## Environment Variables

See [`.env.example`](./.env.example) for all variables.

**Required for production:**

```
MONGODB_URI=
AUTH_SECRET=
ADMIN_PASSWORD=
NEXT_PUBLIC_APP_URL=
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## License

MIT
