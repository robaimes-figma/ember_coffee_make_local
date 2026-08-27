import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../lib/cn'
import { IconButton } from './IconButton'

export interface PaginationProps {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
  /** Shown on the left, e.g. "Showing 1–20 of 84". */
  summary?: string
  className?: string
}

export function Pagination({
  page,
  pageCount,
  onPageChange,
  summary,
  className,
}: PaginationProps) {
  if (pageCount <= 1 && !summary) return null

  const pages = pageNumbers(page, pageCount)

  return (
    <nav
      aria-label="Pagination"
      className={cn('flex flex-wrap items-center justify-between gap-3', className)}
    >
      {summary ? <p className="text-sm text-muted">{summary}</p> : <span />}

      <div className="flex items-center gap-1">
        <IconButton
          label="Previous page"
          size="sm"
          variant="outline"
          icon={<ChevronLeft className="size-4" />}
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        />

        {pages.map((entry, index) =>
          entry === 'gap' ? (
            <span key={`gap-${index}`} className="px-1.5 text-sm text-subtle">
              …
            </span>
          ) : (
            <button
              key={entry}
              type="button"
              aria-current={entry === page ? 'page' : undefined}
              onClick={() => onPageChange(entry)}
              className={cn(
                'size-8 rounded-md text-sm font-medium transition-colors',
                entry === page
                  ? 'bg-accent text-on-accent'
                  : 'text-muted hover:bg-surface-hover hover:text-content',
              )}
            >
              {entry}
            </button>
          ),
        )}

        <IconButton
          label="Next page"
          size="sm"
          variant="outline"
          icon={<ChevronRight className="size-4" />}
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
        />
      </div>
    </nav>
  )
}

/** First, last, and a window around the current page, with gaps elsewhere. */
function pageNumbers(page: number, pageCount: number): (number | 'gap')[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1)
  }

  const result: (number | 'gap')[] = [1]
  const start = Math.max(2, page - 1)
  const end = Math.min(pageCount - 1, page + 1)

  if (start > 2) result.push('gap')
  for (let index = start; index <= end; index++) result.push(index)
  if (end < pageCount - 1) result.push('gap')

  result.push(pageCount)
  return result
}
