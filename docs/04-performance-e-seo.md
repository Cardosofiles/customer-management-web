# Performance e SEO

## Visão Geral

O projeto usa **Next.js 16 App Router** com React 19 e React Compiler ativado, o que automaticamente otimiza re-renders na maioria dos componentes. As estratégias de performance e SEO descritas aqui refletem o estado atual do MVP e os próximos passos recomendados.

---

## Performance

### React Compiler

`next.config.ts` habilita o React Compiler via Babel plugin:

```typescript
// next.config.ts
const config = {
  experimental: {
    reactCompiler: true,
  },
};
```

**Efeito prático:**
- Elimina a necessidade de `useMemo`, `useCallback` e `React.memo` na maioria dos casos.
- O compilador infere e aplica memoização automaticamente em tempo de build.
- **Não adicionar** `useMemo`/`useCallback` sem profiling prévio — duplica o trabalho do compilador.

---

### Server Actions vs. Client Fetching

| Cenário | Abordagem adotada | Benefício |
|---|---|---|
| Mutações (criar, editar, excluir) | Server Actions | Zero bundle client-side, validação server-side |
| Listagens com cache e refetch | React Query + Server Action | Cache granular, background refetch, otimistic UI |
| Dados de sessão | `useSession` (Better Auth) | Evita request extra — cookie httpOnly |

---

### Paginação e Filtragem Server-Side

Tabelas de clientes usam paginação e filtragem **server-side**:

- Parâmetros sincronizados com a URL via `use-table-params.ts`.
- Apenas a página atual é carregada — sem buscar todos os registros.
- URL querystring como fonte de verdade: recarregamento preserva estado de filtro.

```
/clients?page=2&search=joao&status=ativo
```

---

### Lazy Loading e Code Splitting

Next.js App Router aplica code splitting automático por rota. Para componentes pesados dentro de uma rota:

```typescript
import dynamic from "next/dynamic";

const HeavyChart = dynamic(() => import("./heavy-chart"), {
  loading: () => <Skeleton />,
  ssr: false,   // desabilitar SSR se o componente usa APIs do browser
});
```

Candidatos a `dynamic()` no projeto:
- Editor CodeMirror (console SQL admin)
- Recharts (gráficos do dashboard de análise)

---

### Fontes

Configurado em `src/utils/fonts.ts` usando `next/font`:

```typescript
import { Geist, Inter } from "next/font/google";

export const geist = Geist({ subsets: ["latin"], display: "swap" });
```

- **`display: "swap"`** evita FOIT (Flash of Invisible Text).
- Fontes servidas do mesmo domínio — sem round-trip externo.
- Fontes incluídas: Geist Sans, Geist Mono, Inter.

---

### Imagens

Usar sempre `next/image` para imagens da aplicação:

```tsx
import Image from "next/image";

<Image
  src="/logo.png"
  alt="Logo"
  width={120}
  height={40}
  priority   // para imagens above-the-fold (LCP)
/>
```

- Otimização automática: WebP/AVIF, lazy load, dimensionamento.
- Atributo `priority` apenas para imagens **above the fold** (impacta LCP).

---

### Sidebar e Layout

O dashboard usa variáveis CSS para dimensionar sidebar e header:

```css
--sidebar-width: 72;     /* unidades Tailwind */
--header-height: 12;
```

Container queries (`@container/main`) permitem layouts responsivos sem `matchMedia` no JS — zero custo de hydration para responsividade.

---

### Conexão com Banco de Dados

O Prisma usa `@prisma/adapter-pg` com pool de conexões nativo do `pg`:

```typescript
// src/lib/prisma.ts
const pool = new Pool({ connectionString: env.DATABASE_URL });
const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });
```

**Recomendações:**
- Configurar `max` connections no pool de acordo com os limites do plano do PostgreSQL em produção.
- Usar `$transaction` para operações que exigem atomicidade.
- Evitar `findMany` sem `take` em tabelas grandes — sempre paginar.

---

## SEO

### Metadados Estáticos

Configurados no Root Layout (`src/app/layout.tsx`):

```typescript
export const metadata: Metadata = {
  title: {
    default: "Customer Management",
    template: "%s | Customer Management",
  },
  description: "MVP de gestão de clientes com console SQL e marketing por e-mail",
  robots: { index: false, follow: false },   // aplicação privada — não indexar
};
```

> A aplicação é **autenticada e privada** — `robots: noindex` é a configuração correta. Não remover sem análise intencional.

---

### Metadados por Página

Cada página pública ou semi-pública deve exportar `metadata` ou `generateMetadata`:

```typescript
// src/app/(dashboard)/clients/page.tsx
export const metadata: Metadata = {
  title: "Clientes",   // resulta em "Clientes | Customer Management"
};
```

```typescript
// src/app/(dashboard)/clients/[id]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const client = await getClient(params.id);
  return { title: client.nomeCompleto ?? client.razaoSocial };
}
```

---

### Open Graph e Compartilhamento

Para a landing page pública (se existir no futuro):

```typescript
export const metadata: Metadata = {
  openGraph: {
    title: "Customer Management",
    description: "Gestão de clientes simplificada",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
  },
};
```

---

### Internacionalização e Acessibilidade

O Root Layout define:

```tsx
<html lang="pt-BR" suppressHydrationWarning>
```

- `lang="pt-BR"` garante leitura correta por screen readers e ferramentas de SEO.
- `suppressHydrationWarning` é necessário pelo `next-themes` (evita mismatch de classe de tema).

---

### Sitemap e robots.txt

Para aplicações privadas (estado atual):

```
# public/robots.txt
User-agent: *
Disallow: /
```

Se uma área pública for adicionada no futuro, gerar sitemap via `src/app/sitemap.ts`:

```typescript
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://app.example.com", lastModified: new Date() },
  ];
}
```

---

## Core Web Vitals — Referências

| Métrica | Meta (Good) | Estratégia no projeto |
|---|---|---|
| **LCP** (Largest Contentful Paint) | < 2.5s | `priority` em imagens hero, Server Components para dados |
| **INP** (Interaction to Next Paint) | < 200ms | React Compiler, Server Actions, evitar re-renders |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Dimensões explícitas em imagens, skeleton loaders |

---

## Checklist de Performance por Feature

Ao adicionar uma nova feature, verificar:

- [ ] Dados carregados server-side quando possível (Server Component ou Server Action)?
- [ ] Tabela com paginação server-side?
- [ ] Componentes pesados importados com `dynamic()`?
- [ ] Imagens usando `next/image` com dimensões explícitas?
- [ ] Sem `useMemo`/`useCallback` desnecessários (React Compiler já faz isso)?
- [ ] `metadata` exportado na página?
- [ ] Queries Prisma com `take`/`skip` para evitar full table scan?
