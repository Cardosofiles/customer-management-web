# Clientes Seed Design (PF/PJ)

## Goal

Populate the database with 20 PF and 20 PJ clients using reproducible random data for UI testing.

## Scope

- Add a seed routine to create 20 PF and 20 PJ records.
- Use a deterministic PRNG with a fixed seed for repeatable output.
- Keep CPF/CNPJ unique to avoid constraint violations.

## Non-Goals

- No schema changes or migrations.
- No external faker library dependency.

## Architecture

- Extend `prisma/seed.ts` with `seedClientes()`.
- Use an in-file PRNG with a fixed seed string to generate values.
- Generate PF and PJ with minimal required fields plus contact and address data.

## Data Model Mapping

### PF (Pessoa Fisica)

- `tipo`: `PESSOA_FISICA`
- `nomeCompleto`, `cpf`, `rg`, `dataNascimento`
- Address: `cep`, `rua`, `numero`, `bairro`, `cidade`, `estado`
- Contact: `email`, `telefone`, `celular`
- `ativo`: true

### PJ (Pessoa Juridica)

- `tipo`: `PESSOA_JURIDICA`
- `razaoSocial`, `nomeFantasia`, `cnpj`, `inscricaoEstadual`, `inscricaoMunicipal`
- `responsavelNome`, `responsavelCargo`
- Address and contact similar to PF
- `ativo`: true

## Data Generation Strategy

- Build small in-file lists for names, streets, cities, and roles.
- Implement a simple PRNG (e.g. mulberry32) seeded by a constant string.
- Ensure CPF/CNPJ are generated with unique suffixes based on index.
- Generate `email` values from name + index with fixed domain.

## Idempotency

- Use `cpf` and `cnpj` as natural keys to avoid duplicates.
- On conflicts, skip creation (do not update existing data).

## Error Handling

- If generation hits unique conflicts, skip that record and continue.
- Log summary at the end with counts created.

## Testing/Verification

- Run seed twice: counts do not increase.
- Check CRUD pages show 40 records with PF/PJ mix.

## Rollout Plan

1. Implement `seedClientes()` in `prisma/seed.ts`.
2. Call it after `seedAdmin()`.
3. Run `pnpm db:seed`.
