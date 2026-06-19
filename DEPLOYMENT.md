# Vercel Deployment Guide — Artisan Haven

Step-by-step guide to deploy **Artisan Haven** on [Vercel](https://vercel.com).

---

## Prerequisites

- GitHub account with this repo pushed
- [MongoDB Atlas](https://www.mongodb.com/atlas) free cluster
- [Vercel](https://vercel.com) account (free tier works)

---

## Step 1 — MongoDB Atlas

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. **Database Access** → Add user with password.
3. **Network Access** → Add IP `0.0.0.0/0` (allow from anywhere — required for Vercel serverless).
4. **Connect** → Drivers → copy connection string:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

---

## Step 2 — Push code to GitHub

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

---

## Step 3 — Import project on Vercel

1. Go to [vercel.com/new](https://vercel.com/new).
2. Import your GitHub repository.
3. Vercel auto-detects **Next.js** — leave defaults:
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build`
   - **Install Command:** `npm install`

4. **Do not deploy yet** — add environment variables first.

---

## Step 4 — Environment variables (required)

In Vercel → Project → **Settings** → **Environment Variables**, add:

| Variable | Value | Environments |
|----------|-------|--------------|
| `MONGODB_URI` | Your Atlas connection string | Production, Preview, Development |
| `MONGODB_DB_NAME` | `artisan_haven` | Production, Preview, Development |
| `AUTH_SECRET` | Random 32+ char string | Production, Preview, Development |
| `ADMIN_PASSWORD` | Secure admin password | Production, Preview, Development |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` | Production |

### After first deploy

Once Vercel gives you a URL (e.g. `artisan-haven.vercel.app`), set:

```
NEXT_PUBLIC_APP_URL=https://artisan-haven.vercel.app
```

Then **redeploy** so magic links and Stripe redirects use the correct URL.

> Vercel also sets `VERCEL_URL` automatically as a fallback.

---

## Step 5 — Environment variables (optional)

| Variable | Purpose |
|----------|---------|
| `SMTP_HOST` | Gmail: `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_SECURE` | `false` |
| `SMTP_USER` | `vandan11patel@gmail.com` |
| `SMTP_PASS` | Gmail App Password |
| `SMTP_FROM` | `Artisan Haven <vandan11patel@gmail.com>` |
| `STRIPE_SECRET_KEY` | Stripe payments |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe client key |
| `OPENAI_API_KEY` | AI features |

---

## Step 6 — Deploy

Click **Deploy**. Build takes ~2–3 minutes.

### Verify deployment

| URL | Expected |
|-----|----------|
| `https://your-app.vercel.app` | Homepage loads |
| `https://your-app.vercel.app/api/health` | `{ "status": "ok" }` |
| `https://your-app.vercel.app/login` | Sign-in page |

---

## Step 7 — First login (admin)

On first login, the app seeds your admin account:

| Email | Password |
|-------|----------|
| `vandan11patel@gmail.com` | Your `ADMIN_PASSWORD` env var |

1. Go to `/login`
2. Sign in with password or magic link
3. Redirected to `/dashboard/admin`

**Change `ADMIN_PASSWORD` before going live.**

---

## Step 8 — Custom domain (optional)

1. Vercel → Settings → **Domains**
2. Add your domain
3. Update `NEXT_PUBLIC_APP_URL` to your domain
4. Redeploy

---

## Troubleshooting

### Build fails
- Check Vercel build logs
- Run `npm run build` locally

### `Database not configured`
- Add `MONGODB_URI` in Vercel env vars and redeploy

### Magic link broken
- Set `NEXT_PUBLIC_APP_URL` to exact production URL with `https://`
- Use Gmail App Password for SMTP

### MongoDB timeout
- Allow `0.0.0.0/0` in Atlas Network Access
- URL-encode special characters in password

---

## Pre-launch checklist

- [ ] `MONGODB_URI` set
- [ ] `AUTH_SECRET` set (unique random string)
- [ ] `ADMIN_PASSWORD` changed from default
- [ ] `NEXT_PUBLIC_APP_URL` set to production URL
- [ ] `/api/health` returns ok
- [ ] Login works at `/login`
