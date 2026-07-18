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

- **Bilingual (Spanish / English)** — the interface automatically switches to
  Spanish for any browser that prefers Spanish (`Accept-Language`), which
  covers virtually all devices in Venezuela and Latin America. A no-JS
  ES/EN switcher in the header stores an explicit choice in a cookie.
- **Post via WhatsApp (optional bot)** — people can create listings by
  sending a WhatsApp message starting with `NECESITO` or `OFREZCO`; the bot
  replies with the public link and the private management link. See
  [WhatsApp bot](#whatsapp-bot) below.
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
- [Prisma](https://prisma.io) + PostgreSQL (works with the free
  [Neon](https://neon.tech) tier — no server to manage)
- [Leaflet](https://leafletjs.com) + OpenStreetMap tiles

## Local development

```bash
npm install            # also runs `prisma generate`
cp .env.example .env   # then edit values (DATABASE_URL needs a Postgres DB)
npm run db:push        # create/update the database schema
npm run db:seed        # optional: sample listings
npm run dev            # http://localhost:3000
```

### Environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string (a free [Neon](https://neon.tech) database works; on Vercel it's created automatically via the Storage tab) |
| `ADMIN_KEY` | Secret key for the `/admin` moderation page. Admin is disabled until this is set to something other than `change-me`. |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (default `https://humanade.org`) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Optional. Bot's WhatsApp number; when set, a "Post via WhatsApp" button appears on the `/post` page. |
| `WHATSAPP_VERIFY_TOKEN` | Optional. Any random string you invent — pasted into Meta's webhook configuration. |
| `WHATSAPP_ACCESS_TOKEN` | Optional. Permanent access token from your Meta app (System User token). |
| `WHATSAPP_PHONE_NUMBER_ID` | Optional. From WhatsApp → API Setup in the Meta dashboard. |
| `WHATSAPP_APP_SECRET` | Optional but recommended. Meta App secret; enables webhook signature verification. |

## Deploying

### Vercel (fastest — free tier, no server to manage)

1. Sign in at [vercel.com](https://vercel.com) with the GitHub account that
   owns this repo and import `spreadenergy/humanade` (branch `main`).
2. In the project's **Storage** tab, create a **Neon (Postgres)** database —
   this sets `DATABASE_URL` automatically.
3. In **Settings → Environment Variables**, add `ADMIN_KEY` (long random
   value) and `NEXT_PUBLIC_SITE_URL` (the deployment URL, later
   `https://humanade.org`).
4. Redeploy. The build runs `prisma db push` and seeds sample data
   automatically (seeding skips if the database already has listings).
5. To use the real domain: **Settings → Domains → add humanade.org**, then
   create the DNS records Vercel shows inside Hostinger's DNS zone editor.

### Hostinger VPS (or any Linux server)

Humanade is a standard Node.js app: build once, then run `npm start`.

1. Install Node.js 20+, pm2, and git; clone this repo.
2. `cp .env.example .env` and set `DATABASE_URL` (a free
   [Neon](https://neon.tech) database is the easiest — nothing to install),
   `ADMIN_KEY`, and `NEXT_PUBLIC_SITE_URL=https://humanade.org`.
3. Run `SEED=1 bash scripts/deploy.sh` — it installs, syncs the schema,
   seeds (first run only), builds, and starts the app under pm2 on port 3000.
4. Reverse-proxy the domain to the app's port with SSL (Caddy or Nginx).
5. For updates: `bash scripts/deploy.sh`.

## WhatsApp bot

In Venezuela (and much of Latin America) relief requests move through
WhatsApp groups. The optional bot lets people post to Humanade with a single
WhatsApp message — no browser needed.

**How people use it** — they send a message to the bot's number:

```
NECESITO agua potable para 30 familias
Dónde: La Guaira, Vargas
Nombre: María Rivera
```

- `NECESITO` (or `NECESITAMOS`) creates a need; `OFREZCO` / `TENGO` creates
  an offer.
- The `Dónde:` line is required — if it's missing, the bot replies asking
  for it. `Nombre:` is optional (the WhatsApp profile name is used otherwise).
- The word `URGENTE` anywhere marks the listing as critical.
- The category is inferred from keywords (agua/comida → Alimentación,
  medicinas → Salud, camión → Logística, etc.).
- The sender's WhatsApp number automatically becomes the listing's contact
  channel, and the bot replies with the public link plus the **private
  management link** to edit or close the listing later.
- Any other message (e.g. "hola") gets a friendly instructions reply.

**How to set it up** (Meta WhatsApp Cloud API, free tier is enough to start):

1. Go to [developers.facebook.com](https://developers.facebook.com), create
   an app of type **Business**, and add the **WhatsApp** product.
2. In *WhatsApp → API Setup*: note the **Phone Number ID** and add a real
   phone number for the bot (the free test number works for piloting with up
   to 5 recipients; for public use, register a dedicated number — a cheap
   prepaid SIM works).
3. Create a permanent token: *Business Settings → Users → System Users* →
   create a system user, grant it the app with `whatsapp_business_messaging`
   permission, and generate a token. This is `WHATSAPP_ACCESS_TOKEN`.
4. In *WhatsApp → Configuration → Webhook*, set:
   - Callback URL: `https://humanade.org/api/whatsapp/webhook`
   - Verify token: the value you put in `WHATSAPP_VERIFY_TOKEN` (any string
     you invent)
   - Subscribe to the **messages** webhook field.
5. Copy the App Secret (*App Settings → Basic*) into `WHATSAPP_APP_SECRET`.
6. Set all `WHATSAPP_*` variables (plus `NEXT_PUBLIC_WHATSAPP_NUMBER`) on the
   server and restart the app. Send "hola" to the bot's number — it should
   reply with posting instructions.

**Promotion tip for field teams:** share the bot number in existing relief
WhatsApp groups with a pinned example message. People can forward requests
they already wrote — they just add `NECESITO` and `Dónde:`.

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
