# Database Compose Design (Postgres + pgAdmin)

## Goal

Provide a local, isolated Postgres + pgAdmin setup via Docker Compose for the customer-management project, with all configuration sourced from `.env` and example values in `.env.example`.

## Scope

- Add a `docker-compose.yml` with Postgres and pgAdmin services.
- Centralize all runtime settings in `.env`.
- Provide safe example values in `.env.example` for the remote repository.
- Keep Prisma connection via `DATABASE_URL` and support the existing app env schema.

## Non-Goals

- No production deployment or managed database setup.
- No schema or Prisma migration changes in this step.

## Architecture

- **Services**: `postgres` and `pgadmin`.
- **Network**: isolated Compose network for internal service discovery.
- **Persistence**: named volumes for both Postgres and pgAdmin.
- **Health**: Postgres healthcheck; pgAdmin depends on Postgres health.

## Configuration

### Environment variables (.env)

- Container names for both services.
- Host ports for Postgres (5432) and pgAdmin (5050).
- Database name, user, and password.
- pgAdmin default email and password.
- `DATABASE_URL` for application usage (host connection).

### Example variables (.env.example)

- Same keys, sanitized values (no real secrets).

## Data Flow

- Application connects to Postgres via `DATABASE_URL`.
- pgAdmin connects to Postgres within the Compose network using the service name.

## Error Handling

- Postgres healthcheck ensures pgAdmin starts after DB is ready.
- `restart: unless-stopped` for resiliency in local dev.

## Testing/Verification

- `docker compose up -d`
- Verify Postgres on localhost:5432.
- Verify pgAdmin on localhost:5050.
- Confirm the app can connect using `DATABASE_URL`.

## Rollout Plan

1. Create `docker-compose.yml`.
2. Update `.env` and `.env.example`.
3. Run Compose and verify connectivity.
