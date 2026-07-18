# Humanade

**Connecting Human Needs with Human Solutions.**

Humanade is the simplest way to ask for help or offer help — a public
noticeboard that connects people who need something (water, food, medicine,
shelter, transport, professionals, volunteers) with people, organizations, and
businesses who can provide it. Think of it as *Craigslist for helping people*:
practical infrastructure, not a charity website.

Humanade is a platform of the
[Institute for Human Evolution](https://ihe.institute), a nonprofit
organization. Live at **[humanade.org](https://humanade.org)**.

## How it works

1. **Post** — "I Need Help" or "I Can Help". No account required; posting
   takes under a minute.
2. **Connect** — people reach the poster directly by phone, WhatsApp, or
   email. Humanade never sits in the middle.
3. **Resolve** — every listing comes with a **private management link**
   (shown once after posting) used to edit the listing, mark it
   assigned/fulfilled, or close it.

### Features

- Post needs and offers across 8 categories (Connect, Health, Dental,
  Nutrition, Shelter, Volunteers, Logistics, Education)
- Browse, full-text search, and filter by type, category, urgency, and status
- Listing lifecycle: open → assigned → fulfilled / closed
- Map view (Leaflet + OpenStreetMap — no API keys) with optional
  drop-a-pin location on every listing
- Direct contact via `tel:`, WhatsApp, and `mailto:` links
- Lightweight moderation panel at `/admin` (protected by `ADMIN_KEY`)
- Read-only JSON API at `/api/listings` for relief organizations
- Built for weak connections: server-rendered pages, system fonts, no
  client-side data fetching; browse/search/filter work with JavaScript
  disabled. The map loads only on pages that need it.

## Stack

- [Next.js](https://nextjs.org) (App Router, TypeScript) — runs as a plain
  Node.js app
- [Tailwind CSS 4](https://tailwindcss.com)
- [Prisma](https://prisma.io) + SQLite (swappable to Postgres/MySQL by
  changing the datasource + `DATABASE_URL`)
- [Leaflet](https://leafletjs.com) + OpenStreetMap tiles

## Local development

```bash
npm install            # also runs `prisma generate`
cp .env.example .env   # then edit values
npm run db:push        # create/update the SQLite database
npm run db:seed        # optional: sample listings
npm run dev            # http://localhost:3000
```

### Environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Prisma connection string, e.g. `file:./humanade.db` (relative to `prisma/schema.prisma`, i.e. the file lives at `prisma/humanade.db`) |
| `ADMIN_KEY` | Secret key for the `/admin` moderation page. Admin is disabled until this is set to something other than `change-me`. |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (default `https://humanade.org`) |

## Deploying on Hostinger (Node.js)

Humanade is a standard Node.js app: build once, then run `npm start`.

1. Push this repository and connect it to your Hostinger Node.js
   app / VPS.
2. Set environment variables (`DATABASE_URL`, `ADMIN_KEY`,
   `NEXT_PUBLIC_SITE_URL=https://humanade.org`).
3. Build and initialize:
   ```bash
   npm install
   npm run db:push
   npm run db:seed   # optional
   npm run build
   ```
4. Start with `npm start` (respects the `PORT` env var Hostinger assigns,
   e.g. `PORT=3000 npm start`), or with PM2 on a VPS:
   ```bash
   pm2 start npm --name humanade -- start
   pm2 save
   ```
5. Point the `humanade.org` domain / reverse proxy at the app's port.

**SQLite note:** the database is a file (`prisma/humanade.db`). Make sure it
lives on persistent storage and is included in backups. For higher traffic,
switch the Prisma datasource to Postgres and update `DATABASE_URL` — no code
changes needed.

## Moderation

Open `/admin`, enter the `ADMIN_KEY` value, and you can hide/unhide or delete
any listing. Hidden listings disappear from browse, map, API, and search but
remain in the database.

## Roadmap (post-MVP)

- Multi-language UI (Spanish first)
- Email/SMS notification of the management link
- Verified organization badges
- Offline-first PWA enhancements
- Matching suggestions between nearby needs and offers

---

© Institute for Human Evolution · Humanade is free to use, for everyone,
everywhere.
