# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing site for a staircase design/installation business, with an admin panel. Next.js 15 (App Router), React 19, TypeScript strict, deployed to Cloudflare Workers (free plan) through `@opennextjs/cloudflare`, with D1 for data and KV for images. All UI text is Vietnamese. The public UI is a port of the single-file demo at `../demo/index.html`.

## Commands

```bash
npx wrangler d1 migrations apply DB --local   # local schema + seed
npm run dev        # http://localhost:3000
npm run build      # also lints + type-checks
npm run lint / npm run typecheck
npm run preview    # OpenNext build, run on local workerd (real D1/KV/Cache API behaviour)
npm run deploy     # OpenNext build + deploy
npm run cf-typegen # regenerate cloudflare-env.d.ts after changing wrangler.jsonc/.dev.vars keys
```

No test framework.

## Architecture

- **Two styling systems, kept separate.** The public site (`app/(site)/`) uses plain CSS copied from the demo (`site.css`, class names like `.card`, `.ph`, `.container`). The admin uses Tailwind v4 via `app/admin/admin.css`, which sets `source(none)` and only scans `app/admin` and `components/admin`. Do not use Tailwind classes in `components/site`, and do not import admin.css outside admin, or Tailwind's `container`/preflight will break the site layout. The root `app/layout.tsx` has no CSS.
- **Data (D1).** Tables: `settings` (key/value), `categories`, `products`, `projects`, `images`, `leads`. All reads are in `server/content.ts`, writes in `server/mutations.ts`, and row mapping in `server/rows.ts`. Public pages batch their queries (`db.batch`) into one round trip. `getSiteBase()` is wrapped in React `cache()` so the layout and the page share it.
- **Images.** The `images` table is polymorphic (`owner_type` + `owner_id`, no FK), so deleting an owner must go through `deleteOwner()` in `server/images.ts`, which removes the rows and the KV files. Files live in KV at `img/<id>/lg|sm`; the browser compresses them first (`lib/imageCompress.ts`), and they are uploaded via `POST /api/admin/images` (a route handler, because server actions cap the body at 1MB). The first image by `sort_order` is the cover. Image ids are never reused, so `/img/[id]/[size]` is served `immutable`, plus Cache API (`caches.default`, custom domains only) and KV `cacheTtl`.
- **Auth.** One password (`ADMIN_PASSWORD`) and an HMAC-signed cookie (`AUTH_SECRET`), in `server/auth.ts`. `admin/(panel)/layout.tsx` calls `requireAdmin()`, but every server action in `app/admin/actions.ts` must call `requireAdmin()` and validate its argument types itself, because actions are public endpoints.
- **Public form.** `submitLeadAction` in `app/(site)/actions.ts` is unauthenticated; it validates input and has a honeypot field `website`.
- Pages are `force-dynamic` (the incremental cache is read-only static assets; no ISR). Next 15 `params`/`searchParams` are Promises.
- Static marketing copy (reasons, steps, testimonials, FAQ) is in `src/data/site.ts`; anything the owner edits belongs in D1.
- Schema changes need a new migration file, applied `--local` and `--remote`.
