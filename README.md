# StagePass — Event Booking Platform

A full-stack event ticket booking system: browse events, hold seats for a limited time, pay, and get a ticket code.

## Live demo

| | |
|---|---|
| **Frontend** | https://event-booking-frontend-snowy.vercel.app/ |
| **Backend API** | https://event-booking-vqxe.onrender.com |
| **Health check** | https://event-booking-vqxe.onrender.com/health |

> The backend runs on a free Render instance, which sleeps after ~15 minutes of inactivity. The first request after that takes roughly a minute to wake up — this is expected, not an outage.

### Key features

- **Event catalogue** — browse upcoming events and their available seats
- **Time-limited seat reservation** — a hold locks the seat, so two users cannot buy the same one
- **PayPal Sandbox checkout** — behind a `PaymentProvider` interface, so the gateway is swappable
- **JWT authentication with refresh-token flow** — short-lived access token, refresh token in an `HttpOnly` cookie
- **Google OAuth login** — sign in with a Google account, no password to manage
- **Ticket generation with unique ticket code** — every confirmed booking gets a code for lookup
- **Automatic release of expired reservations** — a scheduler frees unpaid holds
- **Admin role support** — the account in `ADMIN_EMAIL` is promoted to `ADMIN` on first sign-in
- **CI/CD with GitHub Actions** — `.github/workflows/ci.yml` builds and tests the backend, lints and builds the frontend, then triggers deploys to Render and Vercel on merge to `main`

API contract: [`docs/api/api-spec/openapi.yaml`](docs/api/api-spec/openapi.yaml)

## Architecture

Three deployable pieces, each owned by a different boundary:

```
┌─────────────────────────┐        ┌─────────────────────────┐
│  Frontend               │  HTTPS │  Backend                │
│  Next.js 16 (App Router)│───────▶│  Spring Boot 4 / Java 17│
│  Vercel                 │        │  Docker image on Render │
└─────────────────────────┘        └───────────┬─────────────┘
                                                 │ JDBC
                                                 ▼
                                    ┌─────────────────────────┐
                                    │  PostgreSQL              │
                                    │  Neon (prod)             │
                                    │  docker compose (local)  │
                                    └─────────────────────────┘
```

### Backend

Layered, organised by feature rather than by technical type:

```
backend/src/main/java/com/truc/eventbooking/
├── auth/          registration, login, JWT, Google OAuth
├── booking/       booking confirmation + ticket lookup by code
├── event/         event catalogue
├── payment/       payment orders, provider abstraction (PayPal)
├── reservation/   time-limited seat holds with expiry
├── seat/          seat inventory
├── config/        security, seed data
├── security/      JWT filter, principal
└── common/        error handling
```

HTTP surface: `/api/auth`, `/api/events`, `/api/events/{id}/seats`, `/api/reservations`, `/api/payments`, `/api/bookings`, plus `/health`.

Key design decisions:

- **Seat holds instead of immediate booking.** Reserving creates a time-limited hold (`reservations`); seats flip to `RESERVED` and a scheduler releases any hold that expires unpaid. This stops two users from buying the same seat.
- **Provider abstraction for payments.** `PaymentProvider` (`payment/provider/`) isolates PayPal behind an interface, so the payment logic is not coupled to one gateway.
- **Stateless auth.** JWT access + refresh token. The refresh token is sent as an `HttpOnly` cookie scoped to `path=/api/auth/refresh` and `SameSite=Strict`, so it is neither readable from JavaScript nor sent to any other endpoint — limiting the blast radius if the tab is compromised.
- **Bootstrap admin without an admin UI.** The address in `ADMIN_EMAIL` is promoted to `ADMIN` on first sign-in; afterwards the role lives in the database.

### Frontend

```
frontend/src/
├── app/           App Router routes (thin wrappers only)
├── features/      auth, booking, events, payments, tickets
│   ├── api/       typed fetch wrappers
│   ├── components/
│   └── hooks/
├── components/    layout, providers, ui primitives
└── lib/api/       apiClient — fetch wrapper, token injection, 401 refresh
```

Route files under `app/` stay thin; logic lives in `features/` so it can be reused across pages.

## Tech stack

**Frontend** — Next.js 16.3.3 (App Router), React 19.2.8, TypeScript 5, Tailwind CSS 4, TanStack Query 5, React Hook Form + Zod, Axios, lucide-react, ESLint 9. Deployed on Vercel.

**Backend** — Spring Boot 4.1.0, Java 17, Spring Web MVC, Spring Data JPA (Hibernate), Spring Security, JJWT 0.12.6, Bean Validation, java-dotenv 5.2.2. Containerised and deployed on Render.

**Database** — PostgreSQL 16. Neon in production, local Docker container in development. H2 for the test suite.

**Tooling** — Maven, Docker, Docker Compose, GitHub Actions (CI: build, lint, test → deploy hooks to Render and Vercel).

## Local setup

Prerequisites: JDK 17, Node.js 20, Docker.

**1. Start the database**

```bash
docker compose up -d
```

Postgres comes up on `localhost:5433`.

**2. Configure the backend**

```bash
cd backend
cp .env.example .env
# fill in the values — see the table below
```

**3. Run the backend**

```bash
cd backend
./mvnw spring-boot:run
```

API on `http://localhost:8080`.

On Windows use `mvnw.cmd spring-boot:run` instead.

On first start the app seeds six demo events with seats, since the `events` table is empty. Dates are generated relative to the current day, so the seed never goes stale.

**4. Run the frontend**

```bash
cd frontend
npm install
npm run dev
```

App on `http://localhost:3000`. Then create `frontend/.env.local` — see the table below.

## Required environment variables

Never commit a real `.env`. Both files are gitignored. Copy the examples and keep the values out of version control.

### Backend — `backend/.env` (see `backend/.env.example`)

| Variable | Required | Example / default | Notes |
|---|---|---|---|
| `DB_URL` | yes | `jdbc:postgresql://localhost:5433/event_booking` | In Docker use `postgres:5432`, not `localhost` |
| `DB_USERNAME` | yes | `event_user` | Matches `POSTGRES_USER` in `docker-compose.yml` |
| `DB_PASSWORD` | yes | `event_password` | Matches `POSTGRES_PASSWORD` |
| `JWT_SECRET` | yes | — | HMAC signing key, no default. The app **refuses to start** without it rather than fall back to an insecure value |
| `JWT_ACCESS_EXPIRATION_MS` | yes | `900000` | 15 minutes |
| `JWT_REFRESH_EXPIRATION_MS` | yes | `604800000` | 7 days |
| `GOOGLE_CLIENT_ID` | for Google sign-in | — | Also needed in the frontend as `NEXT_PUBLIC_GOOGLE_CLIENT_ID` |
| `PAYPAL_CLIENT_ID` | for checkout | — | Also needed in the frontend as `NEXT_PUBLIC_PAYPAL_CLIENT_ID` |
| `PAYPAL_CLIENT_SECRET` | for checkout | — | Server-side only, never expose to the browser |
| `ADMIN_EMAIL` | no | empty | When set, this account is promoted to `ADMIN` on sign-in |

Values in a real environment variable or a Render secret take precedence over `backend/.env`.

### Frontend — `frontend/.env.local`

| Variable | Required | Example |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | yes | `http://localhost:8080` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | for Google sign-in | — |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | for checkout | — |

> Anything prefixed `NEXT_PUBLIC_` is inlined into the client JavaScript bundle at build time and is therefore **not a secret** — it is readable by anyone who opens the page. Only public client IDs belong here. Never put `JWT_SECRET` or `PAYPAL_CLIENT_SECRET` in a `NEXT_PUBLIC_` variable, and keep them out of `ARG`/`ENV` instructions in the Dockerfile, where they would end up in the image history.

### Securing your own credentials

These identify your own PayPal merchant account and are yours to keep. Fetch them from your own provider dashboards and set them only in your local `.env` and in your Render/Vercel project secrets:

- PayPal sandbox keys — PayPal Developer Dashboard (sandbox credentials, no real money moves)
- Google OAuth client ID — Google Cloud Console → APIs & Services → Credentials

Because checkout is backed by your own account, the booking flow cannot be exercised by anyone who does not supply their own keys. Everything before the payment step — browsing, seat holds, reservation expiry — works without them.