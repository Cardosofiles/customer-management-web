# Entidades e Relacionamentos

## Visão Geral

O banco de dados é **PostgreSQL** gerenciado pelo **Prisma ORM**. O schema divide-se em dois domínios principais:

1. **Domínio de Negócio** — entidade `Cliente`, núcleo do sistema.
2. **Domínio de Autenticação** — entidades do Better Auth: `User`, `Session`, `Account`, `TwoFactor`, `Passkey`, `QueryLog`.

Schema em: `prisma/schema.prisma`  
Client gerado em: `src/generated/prisma/`

---

## Diagrama de Relacionamentos

```
┌─────────────┐
│   Cliente   │   (entidade de negócio — sem FK para User)
└─────────────┘

┌──────────┐        ┌───────────┐       ┌──────────┐
│   User   │◄───────│  Session  │       │ Account  │
│          │        └───────────┘       │ (OAuth)  │
│          │◄──────────────────────────►│          │
│          │        ┌───────────┐       └──────────┘
│          │◄───────│ TwoFactor │
│          │        └───────────┘
│          │        ┌───────────┐
│          │◄───────│  Passkey  │
│          │        └───────────┘
│          │        ┌──────────┐
│          │◄───────│ QueryLog │
└──────────┘        └──────────┘
```

---

## Entidade: Cliente

Entidade central do sistema. Suporta dois tipos de pessoa:

| Campo       | Tipo Prisma        | Obrigatório         | Descrição                            |
| ----------- | ------------------ | ------------------- | ------------------------------------ |
| `id`        | String (UUID)      | Sim                 | PK gerado automaticamente            |
| `tipo`      | Enum `TipoCliente` | Sim                 | `PESSOA_FISICA` ou `PESSOA_JURIDICA` |
| `ativo`     | Boolean            | Sim (default: true) | Status do cadastro                   |
| `createdAt` | DateTime           | Sim                 | Preenchido automaticamente           |
| `updatedAt` | DateTime           | Sim                 | Atualizado automaticamente           |

### Campos de Pessoa Física

| Campo            | Tipo Prisma | Obrigatório | Descrição                    |
| ---------------- | ----------- | ----------- | ---------------------------- |
| `nomeCompleto`   | String?     | Não         | Nome completo do indivíduo   |
| `cpf`            | String?     | Não         | CPF (armazenado sem máscara) |
| `rg`             | String?     | Não         | RG                           |
| `dataNascimento` | DateTime?   | Não         | Data de nascimento           |

### Campos de Pessoa Jurídica

| Campo          | Tipo Prisma | Obrigatório | Descrição                     |
| -------------- | ----------- | ----------- | ----------------------------- |
| `razaoSocial`  | String?     | Não         | Razão social da empresa       |
| `nomeFantasia` | String?     | Não         | Nome fantasia                 |
| `cnpj`         | String?     | Não         | CNPJ (armazenado sem máscara) |

### Campos de Endereço

| Campo      | Tipo Prisma | Obrigatório | Descrição           |
| ---------- | ----------- | ----------- | ------------------- |
| `endereco` | String?     | Não         | Logradouro + número |
| `cep`      | String?     | Não         | CEP                 |
| `bairro`   | String?     | Não         | Bairro              |
| `cidade`   | String?     | Não         | Cidade              |
| `estado`   | String?     | Não         | UF (2 chars)        |

### Campos de Contato

| Campo      | Tipo Prisma | Obrigatório | Descrição          |
| ---------- | ----------- | ----------- | ------------------ |
| `email`    | String?     | Não         | E-mail principal   |
| `telefone` | String?     | Não         | Telefone fixo      |
| `celular`  | String?     | Não         | Celular / WhatsApp |
| `site`     | String?     | Não         | Site / URL         |

### Campo Adicional

| Campo         | Tipo Prisma | Obrigatório | Descrição   |
| ------------- | ----------- | ----------- | ----------- |
| `observacoes` | String?     | Não         | Texto livre |

### Enum TipoCliente

```prisma
enum TipoCliente {
  PESSOA_FISICA
  PESSOA_JURIDICA
}
```

---

## Entidade: User

Usuário autenticado da aplicação. Gerenciado pelo Better Auth.

| Campo              | Tipo Prisma     | Obrigatório | Descrição                        |
| ------------------ | --------------- | ----------- | -------------------------------- |
| `id`               | String          | Sim         | PK                               |
| `name`             | String          | Sim         | Nome de exibição                 |
| `email`            | String (unique) | Sim         | E-mail de login                  |
| `emailVerified`    | Boolean         | Sim         | Se o e-mail foi verificado       |
| `image`            | String?         | Não         | URL do avatar                    |
| `createdAt`        | DateTime        | Sim         | Criação da conta                 |
| `updatedAt`        | DateTime        | Sim         | Última atualização               |
| `role`             | String?         | Não         | `"admin"` ou `null` (user comum) |
| `banned`           | Boolean?        | Não         | Se o usuário está banido         |
| `banReason`        | String?         | Não         | Motivo do ban                    |
| `banExpires`       | DateTime?       | Não         | Expiração do ban                 |
| `twoFactorEnabled` | Boolean?        | Não         | 2FA habilitado                   |

**Relações:** `sessions[]`, `accounts[]`, `twoFactors[]`, `passkeys[]`, `queryLogs[]`

---

## Entidade: Session

Sessão ativa de um usuário.

| Campo       | Tipo Prisma     | Descrição             |
| ----------- | --------------- | --------------------- |
| `id`        | String          | PK                    |
| `expiresAt` | DateTime        | Expiração da sessão   |
| `token`     | String (unique) | Token opaco da sessão |
| `ipAddress` | String?         | IP do cliente         |
| `userAgent` | String?         | User-Agent do browser |
| `userId`    | String          | FK → User.id          |

---

## Entidade: Account

Vincula um usuário a um provedor OAuth ou credencial de senha.

| Campo                   | Tipo Prisma | Descrição                              |
| ----------------------- | ----------- | -------------------------------------- |
| `id`                    | String      | PK                                     |
| `accountId`             | String      | ID do usuário no provedor externo      |
| `providerId`            | String      | `"google"`, `"github"`, `"credential"` |
| `userId`                | String      | FK → User.id                           |
| `accessToken`           | String?     | Token de acesso OAuth                  |
| `refreshToken`          | String?     | Token de refresh OAuth                 |
| `idToken`               | String?     | ID Token (OpenID Connect)              |
| `accessTokenExpiresAt`  | DateTime?   | Expiração do access token              |
| `refreshTokenExpiresAt` | DateTime?   | Expiração do refresh token             |
| `scope`                 | String?     | Escopos OAuth concedidos               |
| `password`              | String?     | Hash bcrypt (credential)               |

---

## Entidade: TwoFactor

Configuração de autenticação de dois fatores (TOTP).

| Campo         | Tipo Prisma | Descrição                            |
| ------------- | ----------- | ------------------------------------ |
| `id`          | String      | PK                                   |
| `secret`      | String      | Segredo TOTP (criptografado)         |
| `backupCodes` | String      | Códigos de backup (JSON serializado) |
| `userId`      | String      | FK → User.id                         |

---

## Entidade: Passkey

Chave de acesso WebAuthn (biometria / hardware key).

| Campo          | Tipo Prisma | Descrição                           |
| -------------- | ----------- | ----------------------------------- |
| `id`           | String      | PK                                  |
| `name`         | String?     | Nome dado pelo usuário à passkey    |
| `publicKey`    | String      | Chave pública do autenticador       |
| `userId`       | String      | FK → User.id                        |
| `credentialID` | String      | ID da credencial WebAuthn           |
| `counter`      | Int         | Contador anti-replay                |
| `deviceType`   | String      | `"singleDevice"` ou `"multiDevice"` |
| `backedUp`     | Boolean     | Se a passkey tem backup em nuvem    |
| `transports`   | String?     | Canais WebAuthn suportados          |
| `createdAt`    | DateTime?   | Data de criação                     |

---

## Entidade: QueryLog

Auditoria de queries SQL executadas via console administrativo.

| Campo       | Tipo Prisma | Descrição                     |
| ----------- | ----------- | ----------------------------- |
| `id`        | String      | PK                            |
| `userId`    | String      | FK → User.id                  |
| `query`     | String      | SQL executado                 |
| `result`    | String?     | Resultado serializado em JSON |
| `error`     | String?     | Mensagem de erro (se falhou)  |
| `createdAt` | DateTime    | Timestamp da execução         |

---

## Resumo dos Relacionamentos

| Origem    | Cardinalidade | Destino     | Descrição                                       |
| --------- | ------------- | ----------- | ----------------------------------------------- |
| `User`    | 1 → N         | `Session`   | Um usuário possui múltiplas sessões             |
| `User`    | 1 → N         | `Account`   | Um usuário pode ter contas em vários provedores |
| `User`    | 1 → N         | `TwoFactor` | Um usuário pode ter configurações 2FA           |
| `User`    | 1 → N         | `Passkey`   | Um usuário pode ter múltiplas passkeys          |
| `User`    | 1 → N         | `QueryLog`  | Um usuário pode executar múltiplas queries      |
| `Cliente` | —             | —           | Entidade independente, sem FK para User         |

---

## Notas de Modelagem

- **Cliente é intencional sem FK para User**: o cadastro de clientes é gerenciado por qualquer usuário autenticado; não há conceito de "dono" do cliente no MVP atual.
- **CPF/CNPJ sem máscara no banco**: formatação é aplicada na camada de apresentação via `src/utils/formater.ts`. Permite buscas consistentes.
- **Campos opcionais em Cliente**: o formulário usa `tipo` para determinar quais campos são relevantes, mas o schema não impõe constraint entre tipo e campos — a validação ocorre via Zod nos schemas de formulário.
- **QueryLog.result como String**: o resultado da query SQL é serializado como JSON string para flexibilidade, dado que o schema do resultado varia por query.
