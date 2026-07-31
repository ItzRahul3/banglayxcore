# BanglaYX CORE

A premium, dark-themed website for the BanglaYX CORE Minecraft server — built with
Next.js 15, TypeScript, Tailwind CSS, Framer Motion, and Supabase. Every piece of
content (vote sites, ranks, staff, and general settings) is editable from the
built-in Admin Panel, no code changes required.

## 1. Prerequisites

- Node.js 18.18+ (Node 20 LTS recommended)
- A free [Supabase](https://supabase.com) project
- A host that supports Next.js server functions (Vercel is the easiest)

## 2. Set up Supabase

1. Create a new Supabase project.
2. Open the **SQL Editor** and run the entire contents of `supabase/schema.sql`.
   This creates all six tables (`admins`, `vote_links`, `ranks`, `staff`,
   `settings`, `website_visits`), enables Row Level Security, and seeds
   default settings.
3. Go to **Authentication → Users → Add user** and create your admin login
   (email + password).
4. Copy that user's UUID, then run this in the SQL Editor to make them an
   admin:
   ```sql
   insert into public.admins (id, username) values ('<paste-user-uuid>', 'owner');
   ```
5. Go to **Project Settings → API** and copy:
   - Project URL
   - `anon` public key
   - `service_role` secret key (keep this one server-side only)

## 3. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_MC_JAVA_IP=play.banglayxcore.fun
NEXT_PUBLIC_DISCORD_INVITE=https://discord.gg/bWTWSUPK2y
DISCORD_SERVER_ID=
```

`DISCORD_SERVER_ID` is optional but needed for the live Discord card — see
Section 5 below. It can also be set later from **Admin → Settings**.

## 4. Run locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` for the site and `http://localhost:3000/admin/login`
for the admin panel.

## 5. Enable live Discord stats

The Discord card uses Discord's free **Server Widget API**, which requires no
bot and no token:

1. In Discord: **Server Settings → Widget → Enable Server Widget**.
2. Copy the **Server ID** (enable Developer Mode in Discord, then right-click
   your server icon → Copy Server ID).
3. Paste it into `DISCORD_SERVER_ID` (env var) or **Admin → Settings → Discord
   Server ID**.

Note: the public Widget API only reports **online member count** and **voice
channel occupants** — it does not expose total member count. If you want a
true total-member count, that requires a Discord bot with the
`GUILD_MEMBERS` intent; the `/api/discord-widget` route is written so a bot
token path can be added there later without touching the frontend.

If the widget is disabled or misconfigured, the site shows "Currently
Unavailable" instead of breaking.

## 6. Live Minecraft status

`/api/mc-status` calls the free, keyless [mcsrvstat.us](https://mcsrvstat.us)
API for `NEXT_PUBLIC_MC_JAVA_IP`, cached for 30 seconds server-side. The home
page polls it every 45 seconds. No setup needed — it works out of the box for
any public Java server.

## 7. Deploy

The project deploys cleanly to Vercel:

```bash
npx vercel
```

Add the same environment variables from `.env.local` in your Vercel project
settings. Any other Node hosting that supports Next.js server routes and
middleware will also work.

## Project structure

```
src/
  app/
    page.tsx                  Home (hero + live status + features)
    vote/ ranks/ rules/ staff/ contact/
    admin/
      login/                  Public login page
      (dashboard)/            Protected admin routes (sidebar layout)
        page.tsx               Dashboard stats
        vote-links/ ranks/ staff/ settings/
    api/
      mc-status/route.ts       Cached Minecraft status endpoint
      discord-widget/route.ts  Cached Discord widget endpoint
      track-visit/route.ts     Visit counter
  components/                 Shared UI (Navbar, Hero, cards, admin/*)
  lib/
    supabase/                 client.ts (browser), server.ts (SSR), admin.ts (service role)
    settings.ts               Server-only settings fetch with defaults
    types.ts                  Shared TypeScript types
  middleware.ts                Protects /admin routes, refreshes session
supabase/schema.sql            Full DB schema + RLS policies
```

## What's admin-editable

| Area | Where |
|---|---|
| Server name, tagline, Java/Bedrock IP & port, hero background, logo | Admin → Settings |
| Discord invite link & server ID | Admin → Settings |
| Default vote reward (key/money) | Admin → Settings |
| Vote sites (add/edit/delete/reorder/enable) | Admin → Vote Links |
| Ranks (price, features, gradient, badge, image) | Admin → Ranks |
| Staff roster (name, role, avatar, Discord handle) | Admin → Staff |

Rank and vote "Buy"/"Vote" buttons, plus the floating Discord button, always
route to whatever Discord invite is set in Settings — no online payments are
processed on the site itself, matching the ticket-based purchase flow.

## Notes on this build

- Design direction leans into an actual "inventory slot" visual language
  (notched card corners, ore/gold accent colors) rather than generic
  glassmorphism, per the brief's dark + green/gold theme.
- `next/font/google` needs internet access at build time to fetch Sora,
  Press Start 2P, and JetBrains Mono — this is normal for any Next.js project
  and works on Vercel/any standard CI out of the box.
- The build was verified end-to-end (`npm run build`) against all 16 routes.
