# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
pnpm dev          # Start Next.js dev server
pnpm build        # Production build
pnpm lint         # Run ESLint

# Database
pnpm db:migrate   # Run Prisma migrations (dev)
pnpm db:generate  # Regenerate Prisma client after schema changes
pnpm db:studio    # Open Prisma Studio
pnpm db:seed      # Seed the database (prisma/seed.ts via tsx)
```

> No test suite is configured. There are no test commands.

## Architecture

### Route Groups & Layouts

The app uses Next.js App Router with three route groups:

- `(auth)` — unauthenticated pages (sign-in, sign-up, forgot/reset-password, verify-email)
- `(dashboard)` — authenticated area with `AppSidebar` + `SiteHeader` shell
- `(dashboard)/(admin)` — admin-only sub-area protected by `auth-guard.tsx`; contains SQL console and user management

`src/app/page.tsx` is the root redirect. The dashboard page at `/dashboard` renders the `<Analysis />` module.

### Module Pattern

Feature code lives under `src/modules/<feature>/` and follows this structure:

```
modules/<feature>/
  index.ts              # Re-exports from ui/views
  types/index.ts        # Feature-specific types
  hooks/                # React hooks (data fetching, state)
  ui/
    views/              # Page-level components (consumed by app/ pages)
    components/         # Sub-components used by views
```

Current modules: `auth`, `clients`, `admin`, `profile`, `analysis`.

Pages in `src/app/` are thin — they import and render a single view component from the corresponding module.

### Authentication — Better Auth

Auth is handled by **better-auth** (`src/lib/auth.ts`):
- Plugins enabled: `twoFactor`, `passkey`, `admin`, `nextCookies`
- Social providers: Google, GitHub
- Email/password with required email verification
- Transactional emails sent via Resend (`src/lib/email.ts`)

Client-side auth: `src/lib/auth-client.ts` exports `authClient` and named hooks (`useSession`, `signIn`, `signOut`, etc.).

The catch-all API route `src/app/api/auth/[...all]/route.ts` delegates everything to `toNextJsHandler(auth)`.

### Database — Prisma + PostgreSQL

- Schema: `prisma/schema.prisma`
- Prisma client is generated to `src/generated/prisma/` (non-standard output path)
- Uses `@prisma/adapter-pg` (PrismaPg) for the connection adapter
- Singleton client at `src/lib/prisma.ts`; always import from there
- Key models: `Cliente` (PF/PJ with address & contact fields), `User`, `Session`, `Account`, `TwoFactor`, `Passkey`, `QueryLog`

After any schema change, run `pnpm db:generate` to update the generated client.

### UI Components

- Shadcn/ui components live in `src/components/ui/` — do not edit these manually; use `shadcn` CLI to add/update
- Utility: `cn()` from `src/utils/cn.ts` (clsx + tailwind-merge)
- Icons: `@tabler/icons-react` and `lucide-react`
- Forms: `react-hook-form` + `@hookform/resolvers` + `zod` (v4)
- Tables: `@tanstack/react-table`
- Data fetching/caching: `@tanstack/react-query`
- Toasts: `sonner`

### Environment Variables

Required env vars (see `src/utils/env.ts` for the full list):
`DATABASE_URL`, `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, `NEXT_PUBLIC_BETTER_AUTH_URL`, `APP_NAME`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, plus Resend config for email.
