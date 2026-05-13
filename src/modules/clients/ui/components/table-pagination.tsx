import { Button } from '@/components/ui/button'
import type { JSX } from 'react'

interface TablePaginationProps {
  currentPage: number
  pages: number
  onPageChange: (page: number) => void
}

const VISIBLE_PAGES = 5

const TablePagination = ({
  currentPage,
  pages,
  onPageChange,
}: TablePaginationProps): JSX.Element | null => {
  if (pages <= 1) return null

  const half = Math.floor(VISIBLE_PAGES / 2)
  const start = Math.max(1, Math.min(currentPage - half, pages - VISIBLE_PAGES + 1))
  const end = Math.min(pages, start + VISIBLE_PAGES - 1)
  const pageNumbers = Array.from({ length: end - start + 1 }, (_, i) => start + i)

  return (
    <nav aria-label="Paginação" className="flex items-center justify-end gap-2">
      <Button
        size="sm"
        variant="outline"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Página anterior"
      >
        ‹
      </Button>

      {start > 1 && (
        <>
          <Button size="sm" variant="outline" onClick={() => onPageChange(1)}>
            1
          </Button>
          {start > 2 && <span className="text-xs text-muted-foreground px-1">…</span>}
        </>
      )}

      {pageNumbers.map((p) => (
        <Button
          key={p}
          size="sm"
          variant={p === currentPage ? 'default' : 'outline'}
          onClick={() => onPageChange(p)}
          aria-label={`Página ${p}`}
          aria-current={p === currentPage ? 'page' : undefined}
        >
          {p}
        </Button>
      ))}

      {end < pages && (
        <>
          {end < pages - 1 && <span className="text-xs text-muted-foreground px-1">…</span>}
          <Button size="sm" variant="outline" onClick={() => onPageChange(pages)}>
            {pages}
          </Button>
        </>
      )}

      <Button
        size="sm"
        variant="outline"
        disabled={currentPage === pages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Próxima página"
      >
        ›
      </Button>
    </nav>
  )
}

export { TablePagination }
