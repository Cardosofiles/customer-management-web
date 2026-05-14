# Padrão de Código

## Princípios Gerais

- **Thin pages** — `src/app/` contém apenas importação + renderização de uma view; lógica zero.
- **Feature modules** — toda lógica de negócio, hooks e UI ficam em `src/modules/<feature>/`.
- **Server Actions** — mutações e queries pesadas ficam em `src/actions/`, chamadas via React Query ou diretamente em Server Components.
- **Zod everywhere** — validação de formulários, env vars e payloads de actions usam Zod v4.
- **Sem mocks de DB em testes** — projeto não possui suíte de testes configurada; validações ocorrem em runtime via Zod e TypeScript.

---

## Estrutura de um Módulo

```
modules/clients/
  index.ts                     # Barrel: export público da feature
  types/index.ts               # Tipos e enums da feature
  hooks/
    use-cep.ts                 # Hook de integração com ViaCEP
    use-table-params.ts        # Hook de URL params para paginação/filtro
  ui/
    views/
      client-form.tsx          # Página de criação/edição (view)
      client-table.tsx         # Página de listagem (view)
    components/
      client-delete-dialog.tsx # Diálogo de confirmação
      form-section.tsx         # Wrapper de seção de formulário
      masked-input-field.tsx   # Input com máscara
      table-pagination.tsx     # Controles de paginação
```

### Regra de importação entre camadas

```
app/page.tsx
  └─ importa de modules/<feature>/index.ts (views)
        └─ views importam hooks/ e components/
              └─ components importam de ui/ e utils/
                    └─ nunca importa de app/
```

---

## Server Actions

Arquivo em `src/actions/<feature>.ts`:

```typescript
'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { clientSchema } from '@/schemas/client'

export async function createClient(formData: unknown) {
  const data = clientSchema.parse(formData)
  const client = await prisma.cliente.create({ data })
  revalidatePath('/clients')
  return client
}
```

- Sempre começam com `"use server"`.
- Validam entrada com Zod antes de qualquer operação no banco.
- Chamam `revalidatePath` ou `revalidateTag` após mutações.
- Nunca expõem detalhes internos de erro ao cliente — encapsule em mensagens genéricas.

---

## Formulários (React Hook Form + Zod)

Padrão adotado em views de criação/edição:

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  nome: z.string().min(2),
  email: z.string().email(),
});

type FormValues = z.infer<typeof schema>;

export function ClientForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { nome: "", email: "" },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    await createClient(data);
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
```

---

## Tabelas (TanStack Table)

```typescript
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table'

const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  manualPagination: true, // paginação server-side
  manualFiltering: true, // filtragem via URL params
  pageCount,
})
```

- Paginação e filtros são gerenciados via URL search params (`use-table-params.ts`).
- Estado de tabela **não** é mantido no `useState` local — reflete sempre a URL.

---

## Data Fetching (React Query)

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Query
const { data, isLoading } = useQuery({
  queryKey: ['clients', filters],
  queryFn: () => getClients(filters),
})

// Mutation com invalidação
const queryClient = useQueryClient()
const { mutate } = useMutation({
  mutationFn: deleteClient,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['clients'] }),
})
```

- Query keys sempre incluem os filtros/params para cache granular.
- Mutations invalidam queries relacionadas no `onSuccess`.

---

## Componentes UI

### Regras para shadcn/ui

- **Nunca** editar arquivos em `src/components/ui/` manualmente.
- Para adicionar ou atualizar: `npx shadcn@latest add <component>`.
- Para customização, criar wrapper em `src/modules/<feature>/ui/components/`.

### Utilitário `cn()`

```typescript
import { cn } from "@/utils/cn";

// clsx + tailwind-merge
<div className={cn("base-class", isActive && "active-class", className)} />
```

---

## Formatação e Máscaras

Helpers centralizados em `src/utils/formater.ts`:

- `formatCPF(value)` — `000.000.000-00`
- `formatCNPJ(value)` — `00.000.000/0000-00`
- `formatCEP(value)` — `00000-000`
- `formatPhone(value)` — `(00) 00000-0000`

Sempre usar estes helpers para exibição; nunca formatar inline nos componentes.

---

## Integração com APIs Externas

### ViaCEP (`use-cep.ts`)

```typescript
const { data } = await fetch(
  `https://viacep.com.br/ws/${cep}/json/`,
  { signal: AbortSignal.timeout(10_000) } // timeout de 10s
)
```

- Timeout explícito de 10 segundos.
- Trata erros de rede e CEP inválido separadamente.
- Preenche automaticamente: logradouro, bairro, cidade, estado.

---

## Prisma — Convenções

```typescript
// Sempre importar o singleton
import { prisma } from '@/lib/prisma'

// Após mudança no schema:
// 1. pnpm db:migrate   → gera e aplica migration
// 2. pnpm db:generate  → atualiza o client em src/generated/prisma/

// Nunca commitar edições manuais em src/generated/prisma/
```

- Prisma Client é gerado em `src/generated/prisma/` (path não-padrão).
- Usar o adapter `@prisma/adapter-pg` — **não** usar `DATABASE_URL` diretamente no client, apenas no adapter.

---

## TypeScript

- Sempre inferir tipos de schemas Zod: `type T = z.infer<typeof schema>`.
- Exportar tipos de `modules/<feature>/types/index.ts`.
- Evitar `any`; usar `unknown` e narrow com type guards ou Zod.
- Tipos globais de autenticação exportados de `src/lib/auth.ts`: `Session`, `AuthUser`.

---

## Convenções de Nomenclatura

| Item                   | Padrão                         | Exemplo                          |
| ---------------------- | ------------------------------ | -------------------------------- |
| Componentes React      | PascalCase                     | `ClientForm`                     |
| Hooks                  | camelCase com prefixo `use`    | `useCep`                         |
| Server Actions         | camelCase, verbo + substantivo | `createClient`                   |
| Arquivos de componente | kebab-case                     | `client-form.tsx`                |
| Schemas Zod            | camelCase com sufixo `Schema`  | `clientSchema`                   |
| Variáveis de ambiente  | SCREAMING_SNAKE_CASE           | `DATABASE_URL`                   |
| Modelos Prisma         | PascalCase em inglês/pt-BR     | `Cliente`, `User`                |
| Campos Prisma          | camelCase                      | `nomeCompleto`, `dataNascimento` |

---

## Commits e Branches

Seguir **Conventional Commits**:

```
feat(clients): add CPF validation on form
fix(auth): correct redirect after email verification
docs(project-instructions): add local setup guide
refactor(marketing): extract email template to module
```

Branches com prefixo de tipo: `feat/`, `fix/`, `docs/`, `refactor/`, `chore/`.
