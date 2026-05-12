'use client'

import dynamic from 'next/dynamic'
import { useCallback, useState, useTransition, type JSX } from 'react'

import { executeSQL } from '@/actions/sql-console'
import type { SqlQueryResult } from '@/modules/admin/types'
import {
  SchemaBrowser,
  type QueryHistoryItem,
} from '@/modules/admin/ui/components/console-sql/schema-browser'
import { SqlResultsTable } from '@/modules/admin/ui/components/console-sql/sql-results-table'

// ✅ ssr: false — CodeMirror usa APIs do browser (document, window)
const SqlEditor = dynamic(
  () => import('../components/console-sql/sql-editor').then((mod) => mod.SqlEditor),
  { ssr: false }
)

interface SchemaColumn {
  column: string
  type: string
}

export interface SqlConsoleViewProps {
  initialSchema: Record<string, SchemaColumn[]>
}

const DEFAULT_QUERY = 'SELECT * FROM "user" LIMIT 10;'
const MAX_HISTORY = 20

const SqlConsoleView = ({ initialSchema }: SqlConsoleViewProps): JSX.Element => {
  const [sql, setSql] = useState(DEFAULT_QUERY)
  const [result, setResult] = useState<SqlQueryResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<QueryHistoryItem[]>([])
  const [isPending, startTransition] = useTransition()

  const handleExecute = useCallback((query: string) => {
    startTransition(async () => {
      try {
        const data = await executeSQL(query)
        setResult(data)
        setError(null)
        setHistory((prev) =>
          [{ sql: query, at: new Date().toISOString() }, ...prev].slice(0, MAX_HISTORY)
        )
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err))
        setResult(null)
      }
    })
  }, [])

  return (
    <div className="flex lg:h-[calc(100vh-4rem)] flex-col overflow-auto lg:overflow-hidden px-4 lg:px-6">
      {/* <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-serif font-semibold text-foreground">
            Editor &amp; Resultados
          </h1>
        </div>
        <div className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Atalho</span> · Ctrl + Enter
        </div>
      </div> */}

      <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="min-h-0 overflow-hidden border border-border/60 bg-card">
          <div className="border-b border-border/60 px-4 py-3">
            <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Esquema</p>
          </div>
          <div className="min-h-0 overflow-auto p-3">
            <SchemaBrowser schema={initialSchema} onSelect={setSql} history={history} />
          </div>
        </aside>

        <section className="flex min-h-0 flex-col gap-4 overflow-hidden">
          <div className="border border-border/60 bg-card">
            <div className="border-b border-border/60 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                Editor
              </p>
            </div>
            <SqlEditor
              value={sql}
              onChange={setSql}
              onExecute={handleExecute}
              isPending={isPending}
            />
          </div>

          <div className="flex min-h-[260px] flex-1 flex-col border border-border/60 bg-card sm:min-h-0">
            <div className="border-b border-border/60 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                Resultados
              </p>
            </div>
            <div className="min-h-0 flex-1 overflow-y-hidden">
              <SqlResultsTable result={result} error={error} isPending={isPending} />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export { SqlConsoleView }
