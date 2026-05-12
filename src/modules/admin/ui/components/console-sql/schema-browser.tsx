'use client'

import type { JSX } from 'react'

export interface SchemaColumn {
  column: string
  type: string
}

export interface QueryHistoryItem {
  sql: string
  at: string
}

export interface SchemaBrowserProps {
  schema: Record<string, SchemaColumn[]>
  onSelect: (sql: string) => void
  history: QueryHistoryItem[]
}

const SchemaBrowser = ({ schema, onSelect, history }: SchemaBrowserProps): JSX.Element => {
  return (
    <aside
      aria-label="Navegador de schema e histórico"
      className="flex w-full flex-col gap-4 overflow-y-auto border-b max-h-44 lg:max-h-none lg:w-56 lg:shrink-0 lg:border-r lg:border-b-0"
    >
      {/* ── Schema ──────────────────────────────────────────────────────── */}
      <section aria-labelledby="schema-heading">
        <p
          id="schema-heading"
          className="mb-1 text-xs font-semibold uppercase text-muted-foreground"
        >
          Schema
        </p>

        {Object.entries(schema).map(([table, columns]) => (
          <details key={table} className="group mb-1">
            <summary className="flex cursor-pointer list-none items-center gap-1 text-sm font-medium hover:text-primary [&::-webkit-details-marker]:hidden">
              <span
                className="text-[10px] text-muted-foreground transition-transform duration-150 group-open:rotate-90"
                aria-hidden
              >
                ▶
              </span>

              <button
                type="button"
                className="flex-1 text-left"
                onClick={() => onSelect(`SELECT * FROM "${table}" LIMIT 100;`)}
                aria-label={`Selecionar tabela ${table}`}
              >
                {table}
              </button>
            </summary>

            <ul className="mt-1 space-y-0.5 pl-4" role="list">
              {columns.map(({ column, type }) => (
                <li key={column} className="text-xs text-muted-foreground">
                  {column}{' '}
                  <span className="opacity-50" aria-label={`tipo ${type}`}>
                    ({type})
                  </span>
                </li>
              ))}
            </ul>
          </details>
        ))}
      </section>

      <section aria-labelledby="history-heading">
        <p
          id="history-heading"
          className="mb-1 text-xs font-semibold uppercase text-muted-foreground"
        >
          Histórico
        </p>

        {history.length === 0 ? (
          <p className="text-xs italic text-muted-foreground">Nenhuma query executada</p>
        ) : (
          <ul role="list" className="space-y-0.5">
            {history.map((item) => (
              <li key={`${item.sql}-${item.at}`}>
                <button
                  type="button"
                  title={item.sql}
                  aria-label={`Executar query: ${item.sql}`}
                  className="block w-full truncate py-0.5 text-left text-xs transition-colors hover:text-primary"
                  onClick={() => onSelect(item.sql)}
                >
                  {item.sql}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </aside>
  )
}

export { SchemaBrowser }
