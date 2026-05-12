# Admin Seed Design

## Goal

Add a secure, idempotent seed that creates or updates an admin user from environment variables, without hard-coded credentials.

## Scope

- Seed an admin user using `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` from `.env`.
- Ensure idempotency: re-running the seed does not create duplicates and enforces `role=admin`.
- Store a strong password hash in the auth tables.

## Non-Goals

- No schema or migration changes.
- No UI changes or admin management screens.
- No production deployment guidance beyond safe local usage.

## Architecture

- **Seed script**: `prisma/seed.ts` reads env vars, validates them, and writes to the auth tables using Prisma.
- **Auth tables**: `User` and `Account` are upserted/updated to ensure admin role and password hash.
- **Hashing**: use a strong hashing algorithm compatible with the auth provider (argon2 or bcrypt as required).

## Configuration

### Environment variables (.env)

- `SEED_ADMIN_EMAIL`: admin login email.
- `SEED_ADMIN_PASSWORD`: admin login password.

## Data Flow

1. Load env vars and validate email/password.
2. Look up user by email.
3. Create or update user with `role=admin` and `emailVerified=true`.
4. Create or update account with the password hash.
5. Log success without printing secrets.

## Error Handling

- Missing env vars -> throw and exit with clear message.
- Password too short -> throw and exit.
- Hashing failure -> throw and exit.

## Security

- No credentials committed to the repo.
- Only hashed passwords stored in DB.
- Logs avoid leaking secrets.

## Testing/Verification

- Run seed twice and confirm no duplicates.
- Sign in using the admin credentials from `.env`.

## Rollout Plan

1. Implement `prisma/seed.ts`.
2. Document `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` in `.env.example` (optional).
3. Run the seed and verify login.
