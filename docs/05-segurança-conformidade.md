# Segurança e Conformidade

## Visão Geral

O projeto lida com dados pessoais de clientes (CPF, CNPJ, endereço, e-mail, telefone), possui um console SQL administrativo de acesso livre ao banco e processa autenticação com múltiplos fatores. Estas características elevam o nível de atenção exigido em segurança e conformidade com a **LGPD (Lei nº 13.709/2018)**.

---

## Modelo de Ameaças

### Superfície de Ataque por Camada

| Camada                | Vetor de risco                      | Controle existente                                       |
| --------------------- | ----------------------------------- | -------------------------------------------------------- |
| Autenticação          | Credential stuffing, brute-force    | Better Auth (rate limit interno), 2FA, passkeys          |
| Sessão                | Session hijacking, CSRF             | Cookie httpOnly + SameSite via Better Auth               |
| Console SQL           | SQL injection, exfiltração de dados | Acesso restrito a `role=admin`, auditoria via `QueryLog` |
| Formulários           | XSS armazenado, input malicioso     | Zod valida server-side; React escapa output por padrão   |
| E-mail marketing      | Phishing, spoofing                  | Resend com SPF/DKIM, verificação de e-mail obrigatória   |
| Variáveis de ambiente | Vazamento de secrets                | Zod valida presença; `NEXT_PUBLIC_` apenas para URL auth |
| Dependências          | Supply chain attack                 | `pnpm audit` recomendado por CI                          |

---

## Autenticação e Sessão

### Fluxo de Sessão (Better Auth)

```
Usuário faz login
  │
  ├─ Credenciais validadas server-side
  ├─ E-mail verificado obrigatoriamente antes do primeiro acesso
  ├─ Cookie httpOnly + SameSite=Lax gerado pelo plugin nextCookies
  └─ Sessão armazenada na tabela Session (PostgreSQL)

Requisição autenticada
  │
  └─ Better Auth valida o cookie em cada request
        └─ Se inválido/expirado → redirect para /sign-in
```

### Proteção de Rotas

```
/sign-in, /sign-up, ...     → públicas (sem sessão)
/(dashboard)/*              → exige sessão válida (Better Auth)
/(admin)/*                  → exige sessão + role === "admin" (auth-guard.tsx)
```

O `auth-guard.tsx` roda **server-side** no layout do grupo `(admin)` — a verificação de role nunca depende do client.

### 2FA e Passkeys

- **TOTP** (`twoFactor` plugin): segredo armazenado criptografado na tabela `TwoFactor`. Códigos de backup são serializados em JSON — tratar como dado sensível.
- **WebAuthn** (`passkey` plugin): chave pública armazenada em `Passkey.publicKey`; contador anti-replay em `Passkey.counter`. A chave privada **nunca** sai do dispositivo do usuário.

### Ban de Usuários

O plugin `admin` do Better Auth permite banir usuários via `User.banned`, `User.banReason` e `User.banExpires`. Usuários banidos têm sessões invalidadas automaticamente.

---

## Console SQL Administrativo

O console SQL é o componente de **maior risco** do sistema — permite executar queries arbitrárias no banco de produção.

### Controles Implementados

| Controle             | Implementação                                                           |
| -------------------- | ----------------------------------------------------------------------- |
| Acesso restrito      | `auth-guard.tsx` exige `role=admin`                                     |
| Auditoria completa   | Toda query é registrada em `QueryLog` com userId, SQL, resultado e erro |
| Histórico rastreável | `QueryLog.createdAt` permite reconstruir linha do tempo de ações        |

### Riscos Residuais e Recomendações

| Risco                                           | Recomendação                                                                                |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Admin executa `DROP TABLE` acidentalmente       | Criar usuário de banco somente-leitura para o console; usuário de escrita apenas para o app |
| Exfiltração de dados via `SELECT *`             | Limitar tamanho do resultado retornado (ex.: `LIMIT 500` forçado server-side)               |
| Queries de longa duração (DoS interno)          | Configurar `statement_timeout` no PostgreSQL para queries do console                        |
| Acesso indevido se conta admin for comprometida | Habilitar 2FA obrigatório para contas com `role=admin`                                      |

### Segregação de Credenciais de Banco (Recomendado)

```
DATABASE_URL          → usuário com permissão de leitura e escrita nas tabelas do app
DATABASE_CONSOLE_URL  → usuário somente-leitura para o console SQL admin
```

---

## Proteção de Dados Pessoais (LGPD)

### Dados Pessoais Coletados

| Entidade   | Campo                                 | Classificação LGPD                       |
| ---------- | ------------------------------------- | ---------------------------------------- |
| `Cliente`  | `cpf`                                 | Dado pessoal identificador               |
| `Cliente`  | `cnpj`                                | Dado de pessoa jurídica                  |
| `Cliente`  | `dataNascimento`                      | Dado pessoal                             |
| `Cliente`  | `email`, `telefone`, `celular`        | Dado pessoal de contato                  |
| `Cliente`  | `endereco`, `cep`, `cidade`, `estado` | Dado pessoal de localização              |
| `User`     | `email`, `name`, `image`              | Dado pessoal do operador                 |
| `Session`  | `ipAddress`, `userAgent`              | Dado de navegação                        |
| `QueryLog` | `query`, `result`                     | Pode conter dados pessoais indiretamente |

### Direitos do Titular (Artigo 18 LGPD)

| Direito                    | Como atender no sistema                                                  |
| -------------------------- | ------------------------------------------------------------------------ |
| Acesso                     | Exportar dados do cliente via consulta Prisma                            |
| Correção                   | Funcionalidade de edição já implementada em `/clients/[id]/edit`         |
| Exclusão                   | Implementar soft-delete (`ativo = false`) + hard-delete após prazo legal |
| Portabilidade              | Exportar dados em CSV/JSON via Server Action                             |
| Revogação de consentimento | Registrar consentimento e possibilitar revogação                         |

### Retenção e Exclusão de Dados

```
Clientes inativos         → manter por período contratual + 5 anos (recomendação fiscal)
Sessões expiradas         → excluir automaticamente após expiresAt
QueryLog                  → manter por 90 dias para auditoria; excluir após
Contas de usuários        → excluir dados pessoais em até 15 dias após solicitação
```

> Implementar um job periódico (cron ou GitHub Actions schedule) para purgar `Session` expiradas e `QueryLog` antigos.

### Armazenamento de CPF/CNPJ

CPF e CNPJ são armazenados **sem máscara** no banco. Isso é correto para buscas consistentes, mas exige:

- Controle de acesso restrito às colunas em produção.
- Logs de acesso a queries que retornem `cpf`/`cnpj` (via `QueryLog`).
- Nunca retornar CPF/CNPJ completo em respostas de listagem — mascarar no frontend (`***.xxx.xxx-**`).

---

## Variáveis de Ambiente

### Classificação por Sensibilidade

| Variável                      | Sensibilidade | Exposta ao browser? |
| ----------------------------- | ------------- | ------------------- |
| `DATABASE_URL`                | Crítica       | Nunca               |
| `BETTER_AUTH_SECRET`          | Crítica       | Nunca               |
| `RESEND_API_KEY`              | Alta          | Nunca               |
| `GOOGLE_CLIENT_SECRET`        | Alta          | Nunca               |
| `GITHUB_CLIENT_SECRET`        | Alta          | Nunca               |
| `BETTER_AUTH_URL`             | Média         | Nunca               |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | Baixa         | Sim (necessário)    |

### Regras

- Variáveis sem prefixo `NEXT_PUBLIC_` **nunca** são enviadas ao browser — o Next.js garante isso em build time.
- `BETTER_AUTH_SECRET` deve ter no mínimo 32 caracteres aleatórios. Gerar com: `openssl rand -base64 32`.
- Nunca commitar `.env`, `.env.local` ou qualquer arquivo com valores reais. Apenas `.env.example` com placeholders.
- Rotacionar `BETTER_AUTH_SECRET` em caso de suspeita de vazamento — todas as sessões ativas serão invalidadas.

---

## Segurança de E-mail

### Configuração Resend

Para evitar que e-mails transacionais caiam em spam ou sejam usados para phishing:

| Configuração | Onde definir   | Descrição                                   |
| ------------ | -------------- | ------------------------------------------- |
| **SPF**      | DNS do domínio | Autoriza o Resend a enviar pelo seu domínio |
| **DKIM**     | DNS do domínio | Assina criptograficamente os e-mails        |
| **DMARC**    | DNS do domínio | Define política de falha para SPF/DKIM      |

Verificar no painel do Resend se o domínio em `RESEND_FROM` está verificado com SPF e DKIM ativos.

### Reset de Senha

- O link de reset expira em tempo curto (configurado no Better Auth).
- Links de reset são de uso único — invalidados após o primeiro clique.
- E-mail de confirmação é enviado após a troca de senha.

### Verificação de E-mail

O Better Auth exige verificação antes do primeiro acesso (`emailVerification.sendOnSignUp: true`). Isso previne:

- Cadastro com e-mails de terceiros.
- Spam de contas não verificadas.

---

## Dependências e Supply Chain

### Auditoria de Vulnerabilidades

```bash
pnpm audit              # lista vulnerabilidades conhecidas
pnpm audit --fix        # aplica correções automáticas quando disponíveis
```

Recomendado executar em CI a cada Pull Request.

### Pacotes de Alta Sensibilidade

Monitorar atualizações de segurança especialmente em:

| Pacote           | Motivo                                      |
| ---------------- | ------------------------------------------- |
| `better-auth`    | Núcleo de autenticação                      |
| `@prisma/client` | Acesso direto ao banco                      |
| `next`           | Framework — patches de segurança frequentes |
| `zod`            | Validação de dados de entrada               |
| `resend`         | Envio de e-mails transacionais              |

---

## Headers de Segurança HTTP

Adicionar em `next.config.ts` para reforçar a postura de segurança:

```typescript
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'", // ajustar conforme CDNs usados
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "connect-src 'self' https://api.resend.com https://viacep.com.br",
    ].join('; '),
  },
]

export default {
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
}
```

---

## Checklist de Segurança por Feature

Verificar antes de cada Pull Request que envolva dados ou autenticação:

### Autenticação e Acesso

- [ ] Rotas novas estão no grupo correto `(auth)`, `(dashboard)` ou `(admin)`?
- [ ] Server Actions que exigem autenticação validam a sessão server-side?
- [ ] Ações admin verificam `role === "admin"` e não apenas no client?

### Dados de Entrada

- [ ] Todo input de usuário é validado com Zod antes de chegar ao Prisma?
- [ ] Campos de texto livre têm limite de tamanho definido no schema Zod?
- [ ] Nenhuma concatenação de string para montar SQL (usar Prisma ORM)?

### Dados Pessoais

- [ ] Campos CPF/CNPJ são mascarados em listagens e logs?
- [ ] Novos campos de dados pessoais estão documentados na tabela LGPD?
- [ ] Não há dados pessoais sendo logados em console ou `QueryLog.result` desnecessariamente?

### Variáveis e Secrets

- [ ] Nenhuma variável sensível tem prefixo `NEXT_PUBLIC_`?
- [ ] Nenhum valor real de `.env` foi incluído no commit?

### E-mail

- [ ] Links em e-mails transacionais expiram em tempo adequado?
- [ ] Template de e-mail não inclui dados sensíveis desnecessários?
