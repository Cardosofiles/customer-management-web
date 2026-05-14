# Arquitetura do Projeto

## Visão Geral

Customer Management Web é uma aplicação **Next.js 16 (App Router)** com PostgreSQL, autenticação completa via Better Auth e interface baseada em shadcn/ui. O projeto foi estruturado como um MVP de gestão de clientes com console SQL administrativo e módulo de marketing por e-mail.

---

## Stack Tecnológica

| Camada         | Tecnologia                            |
| -------------- | ------------------------------------- |
| Framework      | Next.js 16.2.6 (App Router)           |
| Linguagem      | TypeScript                            |
| Estilização    | Tailwind CSS v4                       |
| Banco de Dados | PostgreSQL (via `@prisma/adapter-pg`) |
| ORM            | Prisma 7.8.0                          |
| Autenticação   | Better Auth 1.6.9                     |
| UI Components  | shadcn/ui + Radix UI                  |
| Formulários    | React Hook Form 7 + Zod v4            |
| Tabelas        | TanStack React Table 8                |
| Data Fetching  | TanStack React Query 5                |
| E-mail         | Resend 6                              |
| Animações      | Motion                                |
| Notificações   | Sonner                                |
| Ícones         | Tabler Icons + Lucide React           |
| Gráficos       | Recharts 3                            |

---

## Estrutura de Diretórios

```
src/
├── actions/            # Server Actions do Next.js
│   ├── admin.ts
│   ├── client.ts
│   ├── marketing.ts
│   └── sql-console.ts
│
├── app/                # App Router — apenas páginas finas
│   ├── (auth)/         # Grupo: rotas públicas de autenticação
│   ├── (dashboard)/    # Grupo: área autenticada com shell de layout
│   │   └── (admin)/    # Sub-grupo: área admin protegida por auth-guard
│   ├── api/auth/[...all]/  # Catch-all do Better Auth
│   ├── layout.tsx      # Root layout (lang, fonts, providers)
│   └── page.tsx        # Redirect root → /dashboard
│
├── components/
│   ├── icons/          # SVG icons (GitHub, Google)
│   ├── layout/sidebar/ # Shell: AppSidebar, SiteHeader, NavMain…
│   ├── themes/         # ModeToggle (dark/light)
│   └── ui/             # shadcn/ui — não editar manualmente
│
├── generated/prisma/   # Prisma Client gerado (não commitar edições)
│
├── hooks/              # Hooks globais reutilizáveis
│
├── lib/
│   ├── auth.ts         # Configuração central do Better Auth
│   ├── prisma.ts       # Singleton do Prisma Client
│   └── email.ts        # Templates e envio via Resend
│
├── modules/            # Feature modules (ver padrão abaixo)
│   ├── auth/
│   ├── clients/
│   ├── admin/
│   ├── marketing/
│   ├── analysis/
│   └── profile/
│
├── schemas/            # Schemas Zod compartilhados
├── styles/             # Globals CSS / Tailwind
├── types/              # Tipos TypeScript globais
│
└── utils/
    ├── cn.ts           # clsx + tailwind-merge
    ├── env.ts          # Validação de env vars com Zod
    ├── fonts.ts        # Configuração de fontes (Geist, Inter)
    └── formater.ts     # Máscaras (CPF, CNPJ, CEP, telefone)
```

---

## Grupos de Rotas (Route Groups)

```
app/
├── (auth)/             → /sign-in, /sign-up, /forgot-password,
│                         /reset-password, /verify-email
│   └── layout.tsx      → Layout minimalista, sem sidebar
│
├── (dashboard)/        → /dashboard, /clients, /marketing, /settings
│   ├── layout.tsx      → SidebarProvider + AppSidebar + SiteHeader
│   │
│   └── (admin)/        → /admin/users-management, /admin/sql-console
│       └── layout.tsx  → auth-guard.tsx protege por role=admin
│
└── page.tsx            → redirect para /dashboard
```

### Hierarquia de Proteção

```
Rota pública (auth)
  └─ Sem proteção — Better Auth redireciona se já autenticado

Rota dashboard
  └─ Better Auth valida sessão via cookie httpOnly

Rota admin
  └─ auth-guard.tsx verifica role === "admin" server-side
```

---

## Padrão de Módulos

Toda feature vive em `src/modules/<feature>/` com separação clara de responsabilidades:

```
modules/<feature>/
  index.ts              # Barrel — re-exporta views/hooks públicos
  types/index.ts        # Tipos específicos da feature
  hooks/                # Hooks de dados e estado local
  ui/
    views/              # Componentes de página (importados por app/)
    components/         # Sub-componentes usados pelas views
```

As páginas em `src/app/` são **intencionalmente finas** — importam e renderizam exatamente um componente de view.

---

## Fluxo de Dados

```
Browser
  │
  ├─ React Query (cache + refetch)
  │     └─ Server Actions (src/actions/)
  │           └─ Prisma Client (src/lib/prisma.ts)
  │                 └─ PostgreSQL
  │
  └─ Better Auth Client (src/lib/auth-client.ts)
        └─ /api/auth/[...all] → Better Auth Server (src/lib/auth.ts)
              └─ Prisma (tabelas User, Session, Account…)
```

---

## Autenticação (Better Auth)

Configurado em `src/lib/auth.ts` com os seguintes plugins:

- `twoFactor` — TOTP via app autenticador
- `passkey` — WebAuthn / biometria
- `admin` — controle de roles e ban de usuários
- `nextCookies` — cookies httpOnly automáticos para SSR

Provedores sociais: **Google** e **GitHub**.  
E-mails transacionais (verificação, reset de senha, OTP) enviados via **Resend**.

O cliente em `src/lib/auth-client.ts` exporta `authClient`, `useSession`, `signIn`, `signOut` e demais hooks para uso nos componentes.

---

## Compilador React

`next.config.ts` habilita o **React Compiler** (`reactCompiler: true`), eliminando a necessidade de `useMemo`/`useCallback` manual na maior parte dos casos.

---

## Variáveis de Ambiente

Todas validadas em `src/utils/env.ts` com Zod antes do build:

| Variável                      | Obrigatória | Descrição                          |
| ----------------------------- | ----------- | ---------------------------------- |
| `DATABASE_URL`                | Sim         | String de conexão PostgreSQL       |
| `BETTER_AUTH_SECRET`          | Sim         | ≥ 32 chars                         |
| `BETTER_AUTH_URL`             | Sim         | HTTPS em produção                  |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | Sim         | Exposta ao browser                 |
| `RESEND_API_KEY`              | Sim         | Envio de e-mail                    |
| `RESEND_FROM`                 | Sim         | Endereço remetente                 |
| `GOOGLE_CLIENT_ID/SECRET`     | Sim         | OAuth Google                       |
| `GITHUB_CLIENT_ID/SECRET`     | Sim         | OAuth GitHub                       |
| `APP_NAME`                    | Sim         | Nome da aplicação                  |
| `APP_ENV`                     | Sim         | development / staging / production |
