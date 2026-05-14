<div align="center">

# 🧩 Customer Management Web

> MVP de gerenciamento de clientes com autenticação avançada, editor SQL integrado e painel de configurações completo.

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-316192?style=flat-square&logo=postgresql)](https://www.postgresql.org)
[![Better Auth](https://img.shields.io/badge/Better_Auth-1.6-orange?style=flat-square)](https://better-auth.com)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

</div>

---

## 📋 Sobre o projeto

**Customer Management Web** é um MVP para gerenciamento de clientes, construído com as melhores práticas de arquitetura frontend moderna. O projeto serve como base sólida para sistemas de gestão, com foco em autenticação robusta, UI acessível e organização de código escalável.

### ✨ Funcionalidades

- 📋 **CRUD de Clientes** — listagem, criação, edição e remoção com tabela interativa (PF e PJ)
- 🔐 **Autenticação completa** via Better Auth
  - Login com e-mail e senha
  - OAuth social (Google, GitHub)
  - Autenticação de dois fatores (TOTP + códigos de backup)
  - Passkeys (WebAuthn / FIDO2)
- 🖥️ **Editor SQL** integrado com CodeMirror e syntax highlighting
- 👥 **Gerenciamento de usuários** (admin) com banimento e controle de papéis
- 📊 **Módulo de análise** com gráficos interativos e cards de métricas
- 📣 **Marketing por e-mail** — campanhas segmentadas por público (PF, PJ ou todos), com envio em lote via Resend, painel de aniversariantes e histórico de envios
- 👤 **Painel de configurações** com abas para:
  - Perfil (nome e e-mail)
  - Segurança (troca de senha)
  - Autenticação 2FA
  - Passkeys
  - Contas sociais
  - Sessões ativas
- 🌙 **Tema claro/escuro** com next-themes
- 📧 **Envio de e-mails** transacionais via Resend

---

## 🛠️ Stack tecnológica

### Frontend

| Tecnologia                                     | Versão | Uso                            |
| ---------------------------------------------- | ------ | ------------------------------ |
| [Next.js](https://nextjs.org)                  | 16.2   | Framework React com App Router |
| [React](https://react.dev)                     | 19     | UI library                     |
| [TypeScript](https://www.typescriptlang.org)   | 5      | Tipagem estática               |
| [TailwindCSS](https://tailwindcss.com)         | 4      | Estilização utility-first      |
| [Shadcn UI](https://ui.shadcn.com)             | 4.7    | Componentes acessíveis         |
| [Radix UI](https://www.radix-ui.com)           | 1.4    | Primitivos de UI               |
| [TanStack Query](https://tanstack.com/query)   | 5      | Cache e estado de servidor     |
| [TanStack Table](https://tanstack.com/table)   | 8      | Tabelas headless               |
| [React Hook Form](https://react-hook-form.com) | 7      | Gerenciamento de formulários   |
| [Zod](https://zod.dev)                         | 4      | Validação de schemas           |
| [Lucide React](https://lucide.dev)             | 1.11   | Ícones                         |
| [Sonner](https://sonner.emilkowal.ski)         | 2      | Notificações toast             |
| [Motion](https://motion.dev)                   | 12     | Animações                      |
| [CodeMirror](https://codemirror.net)           | 6      | Editor de código/SQL           |
| [Recharts](https://recharts.org)               | 3.8    | Gráficos                       |
| [dnd-kit](https://dndkit.com)                  | 6      | Drag and drop                  |

### Backend / Infra

| Tecnologia                                   | Versão | Uso                        |
| -------------------------------------------- | ------ | -------------------------- |
| [Prisma ORM](https://www.prisma.io)          | 7      | Acesso ao banco de dados   |
| [PostgreSQL](https://www.postgresql.org)     | 16     | Banco de dados relacional  |
| [Better Auth](https://better-auth.com)       | 1.6    | Autenticação completa      |
| [Resend](https://resend.com)                 | 6      | Envio de e-mails           |
| [Docker](https://www.docker.com)             | —      | Ambiente de banco de dados |
| [SimpleWebAuthn](https://simplewebauthn.dev) | 13     | Passkeys / WebAuthn        |

### Qualidade de código

### Modelos principais (Prisma)

| Modelo | Descrição |
| --- | --- |
| `Cliente` | Pessoa Física ou Jurídica com endereço e contatos |
| `User` / `Session` / `Account` | Autenticação via Better Auth |
| `TwoFactor` / `Passkey` | 2FA e WebAuthn |
| `QueryLog` | Histórico de queries executadas no SQL console |
| `Campaign` / `CampaignSend` | Campanhas de e-mail marketing e registros de envio |

---

## 🔍 Qualidade de código

- **ESLint** — linting com regras para Next.js e TanStack Query
- **Prettier** — formatação consistente
- **TypeScript strict** — tipagem rigorosa em todo o projeto

---

## 🏗️ Arquitetura

O projeto segue uma arquitetura **modular por feature** (inspirada em Clean Architecture), separando responsabilidades em camadas bem definidas:

```
src/
├── app/                          # Rotas Next.js (App Router)
│   ├── (auth)/                   # Sign-in, sign-up, forgot/reset-password, verify-email
│   └── (dashboard)/              # Área autenticada (AppSidebar + SiteHeader)
│       ├── dashboard/            # Módulo de análise
│       ├── clients/              # CRUD de clientes (lista, novo, editar, detalhe)
│       ├── marketing/            # Módulo de e-mail marketing
│       ├── settings/             # Painel de configurações
│       └── (admin)/admin/        # Área admin (SQL console, gerenciamento de usuários)
├── components/                   # Componentes globais reutilizáveis
│   └── ui/                       # Design system (Shadcn UI)
├── modules/                      # Features da aplicação
│   ├── auth/                     # Autenticação (login, cadastro, 2FA, passkeys)
│   ├── clients/                  # CRUD de clientes PF/PJ
│   ├── admin/                    # SQL console + gerenciamento de usuários
│   ├── profile/                  # Configurações de conta e segurança
│   ├── analysis/                 # Dashboard com gráficos e métricas
│   └── marketing/                # Campanhas de e-mail marketing
├── actions/                      # Server Actions (client, admin, marketing)
├── schemas/                      # Schemas Zod de validação
├── types/                        # Tipos globais compartilhados
└── lib/                          # Configurações globais (auth, prisma, email)
```

Cada módulo segue o padrão:

```
modules/<feature>/
├── index.ts              # Re-exports de views
├── types/index.ts        # Tipos específicos da feature
├── hooks/                # useQuery / useMutation isolados
└── ui/
    ├── views/            # Componentes de página (consumidos pelo app/)
    └── components/       # Sub-componentes com responsabilidade única
```

---

## 🚀 Rodando localmente

### Pré-requisitos

- [Node.js](https://nodejs.org) >= 20
- [pnpm](https://pnpm.io) >= 9 (`npm install -g pnpm`)
- [Docker](https://www.docker.com) e Docker Compose

### 1. Clone o repositório

```bash
git clone https://github.com/Cardosofiles/customer-management-web.git
cd customer-management-web
```

### 2. Instale as dependências

```bash
pnpm install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env` com seus valores:

```env
# PostgreSQL (Docker)
POSTGRES_CONTAINER_NAME=customer-management-db
POSTGRES_PORT=5432
POSTGRES_DB=customer_management
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_PGDATA=/data/postgres

# PgAdmin (opcional)
PGADMIN_CONTAINER_NAME=customer-management-pgadmin
PGADMIN_PORT=5050
PGADMIN_DEFAULT_EMAIL=admin@admin.com
PGADMIN_DEFAULT_PASSWORD=admin

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/customer_management

# Better Auth
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=  # gere com: openssl rand -base64 32

# Resend (e-mail)
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM=noreply@seudominio.com

# Seed
SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_PASSWORD=Admin@123456

# OAuth (opcional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

### 4. Suba o banco de dados

```bash
docker compose up -d
```

> PgAdmin disponível em `http://localhost:5050`

### 5. Execute as migrations e gere o client Prisma

```bash
pnpm db:generate
pnpm db:migrate
```

### 6. (Opcional) Execute o seed

```bash
pnpm db:seed
```

### 7. Inicie a aplicação

```bash
pnpm dev
```

Acesse em **[http://localhost:3000](http://localhost:3000)** 🎉

---

## 📜 Scripts disponíveis

| Comando            | Descrição                             |
| ------------------ | ------------------------------------- |
| `pnpm dev`         | Inicia em modo desenvolvimento        |
| `pnpm build`       | Gera build de produção                |
| `pnpm start`       | Inicia o servidor de produção         |
| `pnpm lint`        | Executa o ESLint                      |
| `pnpm db:generate` | Gera o Prisma Client                  |
| `pnpm db:migrate`  | Executa migrations de desenvolvimento |
| `pnpm db:studio`   | Abre o Prisma Studio                  |
| `pnpm db:seed`     | Popula o banco com dados iniciais     |

---

## 🔐 Configurando OAuth (opcional)

### Google

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um projeto e vá em **APIs & Services → Credentials**
3. Crie um **OAuth 2.0 Client ID** com redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Copie `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`

### GitHub

1. Acesse [GitHub Developer Settings](https://github.com/settings/developers)
2. Crie um **OAuth App** com callback URL: `http://localhost:3000/api/auth/callback/github`
3. Copie `GITHUB_CLIENT_ID` e `GITHUB_CLIENT_SECRET`

---

## 👨‍💻 Desenvolvedor

<div align="center">

**Joao Batista Cardoso Miranda**

_Front-end Engineer · SaaS Builder_

[![Portfolio](https://img.shields.io/badge/Portfolio-cardosofiles.com.br-blue?style=flat-square&logo=vercel)](https://www.cardosofiles.com.br/pt)
[![GitHub](https://img.shields.io/badge/GitHub-Cardosofiles-181717?style=flat-square&logo=github)](https://github.com/Cardosofiles)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-cardosofiles-0077B5?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/cardosofiles/)

</div>

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">
  <sub>Feito com ☕ e TypeScript · Uberlândia, MG 🇧🇷</sub>
</div>
