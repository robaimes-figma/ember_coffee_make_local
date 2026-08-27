import { cn } from '../lib/cn'

export const COLORWAYS = ['ember', 'moss', 'harbor', 'amber', 'crimson', 'espresso'] as const
export type Colorway = (typeof COLORWAYS)[number]

/**
 * Each colourway is three steps out of one palette ramp: the backdrop the bag
 * sits on, the bag body, and the darker crimp at the top. Retinting the whole
 * catalogue is a matter of editing this map.
 */
const colorways: Record<Colorway, { backdrop: string; body: string; crimp: string }> = {
  ember: {
    backdrop: 'var(--palette-ember-100)',
    body: 'var(--palette-ember-500)',
    crimp: 'var(--palette-ember-700)',
  },
  moss: {
    backdrop: 'var(--palette-moss-100)',
    body: 'var(--palette-moss-500)',
    crimp: 'var(--palette-moss-700)',
  },
  harbor: {
    backdrop: 'var(--palette-harbor-100)',
    body: 'var(--palette-harbor-500)',
    crimp: 'var(--palette-harbor-600)',
  },
  amber: {
    backdrop: 'var(--palette-amber-100)',
    body: 'var(--palette-amber-500)',
    crimp: 'var(--palette-amber-600)',
  },
  crimson: {
    backdrop: 'var(--palette-crimson-100)',
    body: 'var(--palette-crimson-500)',
    crimp: 'var(--palette-crimson-700)',
  },
  espresso: {
    backdrop: 'var(--palette-cream-200)',
    body: 'var(--palette-espresso-600)',
    crimp: 'var(--palette-espresso-800)',
  },
}

export interface BagArtworkProps {
  colorway: Colorway
  /** Printed on the bag's label. Usually the origin, e.g. "ETHIOPIA". */
  origin: string
  /** Small line under the origin, e.g. the process. */
  caption?: string
  /** Adds a decorative bean pattern to the backdrop. */
  pattern?: boolean
  className?: string
}

/**
 * BagArtwork
 *
 * Product imagery, drawn rather than photographed. Every colour is a token,
 * so the catalogue can never drift out of the brand palette, and it renders
 * identically offline.
 */
export function BagArtwork({
  colorway,
  origin,
  caption,
  pattern = true,
  className,
}: BagArtworkProps) {
  const { backdrop, body, crimp } = colorways[colorway]
  const patternId = `bean-pattern-${colorway}`

  return (
    <svg
      viewBox="0 0 240 300"
      role="img"
      aria-label={`${origin} coffee bag`}
      // The artwork is 4:5 but its containers are square on the product page
      // and 4:3 on cards, so the SVG letterboxes. Painting the backdrop on the
      // element itself means the letterbox is the same colour as the artwork
      // and the seam disappears.
      style={{ backgroundColor: backdrop }}
      className={cn('block h-full w-full', className)}
    >
      <defs>
        <linearGradient id={`bag-sheen-${colorway}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#000" stopOpacity="0.16" />
          <stop offset="38%" stopColor="#fff" stopOpacity="0.1" />
          <stop offset="72%" stopColor="#000" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.2" />
        </linearGradient>

        <pattern id={patternId} width="26" height="26" patternUnits="userSpaceOnUse">
          <path
            d="M13 7c3.6 0 6.5 2.7 6.5 6s-2.9 6-6.5 6-6.5-2.7-6.5-6 2.9-6 6.5-6Z"
            fill="none"
            stroke={crimp}
            strokeOpacity="0.18"
            strokeWidth="1.2"
          />
          <path
            d="M9 9.5c2.4 2 3.4 5 2.6 7.6"
            fill="none"
            stroke={crimp}
            strokeOpacity="0.18"
            strokeWidth="1.2"
          />
        </pattern>
      </defs>

      {/* Backdrop */}
      <rect width="240" height="300" fill={backdrop} />
      {pattern ? <rect width="240" height="300" fill={`url(#${patternId})`} /> : null}

      {/* Contact shadow */}
      <ellipse cx="120" cy="266" rx="62" ry="9" fill={crimp} fillOpacity="0.18" />

      {/* Bag body */}
      <path
        d="M62 82h116a6 6 0 0 1 6 6v158a14 14 0 0 1-14 14H70a14 14 0 0 1-14-14V88a6 6 0 0 1 6-6Z"
        fill={body}
      />
      <path
        d="M62 82h116a6 6 0 0 1 6 6v158a14 14 0 0 1-14 14H70a14 14 0 0 1-14-14V88a6 6 0 0 1 6-6Z"
        fill={`url(#bag-sheen-${colorway})`}
      />

      {/* Side gusset fold */}
      <path d="M154 82h8v186h-8z" fill="#000" fillOpacity="0.08" />

      {/* Crimped top */}
      <path d="M58 62h124a4 4 0 0 1 4 4v18H54V66a4 4 0 0 1 4-4Z" fill={crimp} />
      <path
        d="M58 68h124M58 76h124"
        stroke="#fff"
        strokeOpacity="0.14"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Degassing valve */}
      <circle cx="120" cy="112" r="9" fill={crimp} fillOpacity="0.55" />
      <circle cx="120" cy="112" r="3.5" fill={backdrop} fillOpacity="0.7" />

      {/* Label */}
      <rect x="76" y="140" width="88" height="76" rx="4" fill="var(--palette-cream-50)" />
      <text
        x="120"
        y="168"
        textAnchor="middle"
        fill={crimp}
        style={{
          font: '600 13px var(--font-display)',
          letterSpacing: '0.14em',
        }}
      >
        {origin.slice(0, 11).toUpperCase()}
      </text>
      <line x1="92" y1="180" x2="148" y2="180" stroke={body} strokeWidth="1.5" />
      {caption ? (
        <text
          x="120"
          y="198"
          textAnchor="middle"
          fill="var(--palette-espresso-500)"
          style={{ font: '500 8px var(--font-sans)', letterSpacing: '0.08em' }}
        >
          {caption.slice(0, 18).toUpperCase()}
        </text>
      ) : null}
    </svg>
  )
}

/** Deterministic colourway from a product id, so a product always looks the same. */
export function colorwayFor(id: string): Colorway {
  let hash = 0
  for (const character of id) hash = (hash * 31 + character.charCodeAt(0)) % 9973
  return COLORWAYS[hash % COLORWAYS.length]
}
