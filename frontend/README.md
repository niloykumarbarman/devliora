# Devliora — Frontend

The Next.js application for [devliora.com](https://devliora.com): the public
marketing site plus the `/admin` CMS used to manage its content. It is a
client of a separate **ASP.NET Core API** (see `../backend`) — this app renders
pages and talks to that API over HTTP; it has no database of its own.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack), React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (`@tailwindcss/postcss`) |
| Animation | `framer-motion` (scroll reveals, all gated on `prefers-reduced-motion`) |
| Icons | `lucide-react`; brand marks via `src/lib/techIcons.ts` (simple-icons path data) |
| Fonts | `next/font` — Space Grotesk (display), Inter (body), JetBrains Mono (mono) |
| Build output | `standalone` (see `next.config.ts`) |

> **Next.js 16 has breaking API changes** vs. earlier versions. See `AGENTS.md`
> — consult `node_modules/next/dist/docs/` before writing framework code.

## Repository layout

```
src/
  app/            App Router routes (+ sitemap.ts, robots.ts)
    admin/        JWT-protected CMS (disallowed in robots.txt)
    cloud-devops/ Static capability page (content in src/lib/cloudDevops.ts)
  components/
    layout/       Navbar, MegaMenu, Footer
    sections/     Page section components (~85)
    admin/        Admin CRUD scaffolding
  lib/            API clients + static config
    seo.ts        buildMetadata() + JSON-LD helpers (Organization, WebSite,
                  Breadcrumb, Service, Article) — single source of site config
    solutions.ts, megaMenu*.ts, cloudDevops.ts, techIcons.ts  (static content)
    *.ts / admin*.ts  (fetch wrappers around the backend API)
```

Most public content (hero, services, technologies, industries, portfolio,
case studies, blog, testimonials, partners, FAQs, jobs, office locations,
site settings) is **authored in `/admin`** and served by the API. A few pieces
are static in `src/lib` — SEO config, the solutions list, the `/cloud-devops`
page, the mega-menu lists, and tech icon data.

## Local development

Requires **Node 22**. The backend API should be running (see `../backend`), or
point `NEXT_PUBLIC_API_URL` at a deployed one.

```bash
cp .env.example .env      # then edit values
npm ci
npm run dev               # http://localhost:3000
```

If `NEXT_PUBLIC_API_URL` is unset it defaults to `http://localhost:5240/api`
(see `src/lib/apiConfig.ts`). Pages fetch from the API on every request
(`cache: "no-store"`), so with no API reachable the site renders with empty
sections rather than crashing.

### Environment variables

All are `NEXT_PUBLIC_*` and are **baked in at build time** (see `Dockerfile`
build args). Changing them in production requires a rebuild.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API, e.g. `https://devliora.com/api` |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 ID (`G-…`). Analytics only loads if set. |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | Microsoft Clarity project ID. Only loads if set. |

## Scripts

| Command | |
|---|---|
| `npm run dev` | Dev server (Turbopack) on :3000 |
| `npm run build` | Production build (also type-checks) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (`eslint-config-next`) |

There is no automated test suite yet.

## Deployment

Self-hosted on a **VPS with Docker + Nginx** — not Vercel.

- `Dockerfile` — multi-stage `node:22-slim`, produces the standalone server.
- `../infra/docker/docker-compose.prod.yml` — runs `frontend` + `backend` +
  `postgres` + `redis` on one bridge network.
- `../infra/nginx/devliora.com.conf` — reverse proxy: `/` → this app (:3000),
  `/api/` and `/uploads/` → backend (:8080). TLS via Let's Encrypt / Certbot.
- `../.github/workflows/deploy.yml` — on push to `main`, SSHes to the VPS,
  `git reset --hard origin/main`, reloads Nginx, and
  `docker compose -f docker-compose.prod.yml up --build -d`.

Production: <https://devliora.com>
