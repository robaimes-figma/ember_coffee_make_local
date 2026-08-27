import { cn } from '../lib/cn'

export const ROAST_LEVELS = ['light', 'medium', 'medium-dark', 'dark'] as const
export type RoastLevel = (typeof ROAST_LEVELS)[number]

export const ROAST_LABELS: Record<RoastLevel, string> = {
  light: 'Light',
  medium: 'Medium',
  'medium-dark': 'Medium-dark',
  dark: 'Dark',
}

const swatches: Record<RoastLevel, string> = {
  light: 'bg-roast-light',
  medium: 'bg-roast-medium',
  'medium-dark': 'bg-roast-medium-dark',
  dark: 'bg-roast-dark',
}

export interface RoastMeterProps {
  level: RoastLevel
  /** Hides the text label and shows only the four bars. */
  compact?: boolean
  className?: string
}

/**
 * RoastMeter
 *
 * Four bars showing where a coffee sits on the roast spectrum. Filled bars
 * use the roast tokens, so the roast colours stay consistent between this,
 * the shop filters and the product cards.
 */
export function RoastMeter({ level, compact = false, className }: RoastMeterProps) {
  const activeIndex = ROAST_LEVELS.indexOf(level)

  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <span className="inline-flex items-end gap-0.5" aria-hidden>
        {ROAST_LEVELS.map((roast, index) => (
          <span
            key={roast}
            className={cn(
              'w-1.5 rounded-xs transition-colors',
              index <= activeIndex ? swatches[level] : 'bg-border',
              // Bars step up in height so the meter reads as a scale even
              // in greyscale.
              ['h-2', 'h-2.5', 'h-3', 'h-3.5'][index],
            )}
          />
        ))}
      </span>

      {compact ? (
        <span className="sr-only">{ROAST_LABELS[level]} roast</span>
      ) : (
        <span className="text-xs font-medium text-muted">{ROAST_LABELS[level]} roast</span>
      )}
    </span>
  )
}
