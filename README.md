# Devliora

Source for **[devliora.com](https://devliora.com)** — the marketing site plus the
`/admin` CMS that manages its content — and the API behind it.

Devliora is a software engineering company (engineering teams in Bangladesh and
Australia). This repository is a monorepo: a Next.js front end, an ASP.NET Core
API, and the infrastructure to run both.

## Repository layout

```
frontend/     Next.js 16 app — public site + JWT-protected /admin CMS.
              Renders pages, talks to the API over HTTP, has no DB of its own.
              See frontend/README.md.

backend/      ASP.NET Core 10 API (clean architecture / CQRS with MediatR):
                src/Devliora.Domain          entities, enums
                src/Devliora.Application      commands/queries, validation, behaviors
                src/Devliora.Infrastructure   EF Core, Redis, Gemini, Telegram
                src/Devliora.WebApi           controllers, auth, middleware, Program.cs
              See backend/SECRETS.md.

infra/        docker/  docker-compose.yml (local: Postgres + Redis)
                       docker-compose.prod.yml (full stack)
                       .env.example
              nginx/   devliora.com.conf (reverse proxy + TLS)

.github/workflows/deploy.yml   push to main -> SSH deploy to the VPS
SECURITY.md                    secrets handling + a resolved historical exposure
```

## Architecture

```
Browser ──HTTPS──▶ Nginx (VPS, Certbot TLS)
                     /        → frontend  (Next.js standalone)      :3000
                     /api/    → backend   (ASP.NET Core / Kestrel)  :8080
                     /uploads/→ backend static files
                   backend ──▶ PostgreSQL 16   (EF Core; migrations auto-apply on start)
                   backend ──▶ Redis 7         (distributed cache / sessions)
                   backend ──▶ Google Gemini   (on-site assistant chat + Telegram bot)
Client  ── Google Analytics 4 + Microsoft Clarity (loaded only if their env vars are set)
```

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS v4, framer-motion, lucide-react |
| Backend | ASP.NET Core 10, MediatR, FluentValidation, EF Core (Npgsql), StackExchange.Redis, JWT bearer auth, ASP.NET rate limiting, Scalar OpenAPI (dev only) |
| Data | PostgreSQL 16, Redis 7 |
| Infra | Docker Compose, Nginx, Let's Encrypt / Certbot, single VPS |
| Integrations | Google Gemini, Telegram Bot API |
| Analytics | Google Analytics 4, Microsoft Clarity |

## Local development

**Prerequisites:** Node.js 22+, .NET SDK 10, Docker.

### 1. Start Postgres + Redis

```bash
docker compose -f infra/docker/docker-compose.yml up -d
# Postgres on localhost:5433, Redis on localhost:6380
```

### 2. Backend API

```bash
cd backend/src/Devliora.WebApi
dotnet user-secrets set "JwtSettings:SecretKey" "$(openssl rand -base64 48)"   # once
dotnet run
# API on http://localhost:5240  (Scalar API reference at /scalar)
```

The API refuses to start until a 32+ character `JwtSettings:SecretKey` is
supplied (see `backend/SECRETS.md`). It runs pending EF Core migrations and
seeds baseline data on startup.

### 3. Frontend

```bash
cd frontend
cp .env.example .env.local          # NEXT_PUBLIC_API_URL defaults to http://localhost:5240/api
npm install
npm run dev
# http://localhost:3000
```

Useful scripts (in `frontend/`): `npm run dev`, `npm run build`, `npm run lint`.

## Environment variables

Nothing real is committed. Templates:

- `frontend/.env.example` — `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_CLARITY_PROJECT_ID`
- `infra/docker/.env.example` — everything `docker-compose.prod.yml` needs: `POSTGRES_*`, `JWT_SECRET_KEY`, `CORS_ALLOWED_ORIGIN`, the `NEXT_PUBLIC_*` build args, `GEMINI_API_KEY` / `GEMINI_DAILY_QUOTA`, and `TELEGRAM_*`

On the VPS, real values live in `infra/docker/.env` (git-ignored). Secrets are
never placed in any `appsettings*.json` or committed file — see **SECURITY.md**
and **backend/SECRETS.md**.

## Deployment

**Deploy = push to `main`.** `.github/workflows/deploy.yml` then:

1. SSHes to the VPS and `git reset --hard origin/main`
2. copies `infra/nginx/devliora.com.conf` into place and runs `nginx -t && systemctl reload nginx`
3. `docker compose --env-file .env -f infra/docker/docker-compose.prod.yml up --build -d`
4. `docker image prune -f`

The production stack (`docker-compose.prod.yml`) runs `postgres`, `redis`,
`backend` (:8080), and `frontend` (:3000) on a bridge network; Nginx terminates
TLS and reverse-proxies to them. Images are built on the host at deploy time;
there is no separate registry or staging environment.

> The deploy workflow does **not** take a database backup or run tests/scans
> before deploying. Take a `pg_dump` before any deploy that includes schema
> migrations.

## Further reading

- `frontend/README.md` — front-end specifics, routes, component layout
- `backend/SECRETS.md` — generating and supplying the JWT signing key
- `SECURITY.md` — secrets policy, security headers, historical key exposure
