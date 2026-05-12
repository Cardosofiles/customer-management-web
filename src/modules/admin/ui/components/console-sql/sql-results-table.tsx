'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useMemo, type JSX } from 'react'

import type { SqlQueryResult } from '@/modules/admin/types'

export interface SqlResultsTableProps {
  result: SqlQueryResult | null
  error: string | null
  isPending: boolean
}

const MAX_VISIBLE_ROWS = 500

function formatDuration(ms: number): string {
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(2)}s`
}

function cellValue(value: unknown): string {
  if (value === null || value === undefined) return 'NULL'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

const SqlResultsTable = ({ result, error, isPending }: SqlResultsTableProps): JSX.Element => {
  if (isPending) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex items-center justify-center p-8 text-xs uppercase tracking-[0.2em] text-muted-foreground"
      >
        <span className="sr-only">Aguarde, executando query...</span>
        Executando...
      </div>
    )
  }

  // ── Erro ───────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div
        role="alert" // ✅ anunciado imediatamente pelo screen reader
        aria-live="assertive"
        className="m-3 border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
      >
        <span className="font-medium">Erro:</span> {error}
      </div>
    )
  }

  // ── Empty state ────────────────────────────────────────────────────────
  if (!result) {
    return (
      <div
        aria-live="polite"
        className="flex items-center justify-center p-8 text-xs uppercase tracking-[0.2em] text-muted-foreground"
      >
        Nenhuma query executada
      </div>
    )
  }

  return <ResultContent result={result} />
}

// ── Subcomponente isolado para evitar hooks condicionais ──────────────────────
const ResultContent = ({ result }: { result: SqlQueryResult }): JSX.Element => {
  const { rows, duration, rowCount } = result

  const columns = useMemo(() => (rows?.length ? Object.keys(rows[0]) : []), [rows])
  const visibleRows = useMemo(() => rows?.slice(0, MAX_VISIBLE_ROWS) ?? [], [rows])
  const isTruncated = (rows?.length ?? 0) > MAX_VISIBLE_ROWS

  if (!rows?.length) {
    return (
      <div
        aria-live="polite"
        className="p-4 text-xs uppercase tracking-[0.2em] text-muted-foreground"
      >
        {rowCount ?? 0} linhas afetadas · {formatDuration(duration)}
      </div>
    )
  }

  return (
    // ✅ depois — h-full para preencher o pai, sem max-h fixo
    <div className="flex h-full flex-col gap-2 p-3" aria-live="polite">
      <div className="flex shrink-0 items-center justify-between">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {rowCount ?? rows.length} linhas · {formatDuration(duration)}
        </p>
        {isTruncated && (
          <p className="text-xs text-yellow-600 dark:text-yellow-400">
            ⚠ Exibindo {MAX_VISIBLE_ROWS} de {rows.length} linhas
          </p>
        )}
      </div>

      {/* ✅ flex-1 + overflow-auto — scroll APENAS aqui */}
      <div className="min-h-0 flex-1 overflow-auto border border-border/60">
        <div className="inline-block min-w-max">
          <Table
            aria-label={`Resultado da query — ${rowCount ?? rows.length} linhas`}
            className="w-max table-auto"
          >
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead key={col} className="whitespace-nowrap text-muted-foreground">
                    {col}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleRows.map((row, i) => (
                <TableRow key={`${i}-${String(row[columns[0]] ?? '')}`}>
                  {columns.map((col) => {
                    const raw = row[col]
                    const isNull = raw === null || raw === undefined
                    return (
                      <TableCell key={col} className="whitespace-nowrap" title={cellValue(raw)}>
                        {isNull ? (
                          <span className="italic text-muted-foreground">NULL</span>
                        ) : (
                          cellValue(raw)
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export { SqlResultsTable }

// scrollbar-thin scrollbar-thumb-muted-foreground/40 scrollbar-track-transparent
