import { cn } from '../lib/cn'

export interface AvatarProps {
  /** Full name. Used for the initials and the accessible label. */
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  xs: 'size-6 text-2xs',
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-14 text-lg',
}

/**
 * Avatar
 *
 * Initials on a tinted circle. The tint is derived from the name so the same
 * person is always the same colour, without needing stored avatar images.
 */
export function Avatar({ name, size = 'md', className }: AvatarProps) {
  const tints = [
    'bg-accent-soft text-accent-text',
    'bg-success-soft text-success-text',
    'bg-info-soft text-info-text',
    'bg-warning-soft text-warning-text',
    'bg-surface-sunken text-muted',
  ]

  let hash = 0
  for (const character of name) hash = (hash + character.charCodeAt(0)) % 997

  return (
    <span
      title={name}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-semibold select-none',
        tints[hash % tints.length],
        sizes[size],
        className,
      )}
    >
      {initials(name)}
    </span>
  )
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export interface AvatarGroupProps {
  names: readonly string[]
  /** Beyond this, the rest collapse into a "+N" chip. */
  max?: number
  size?: AvatarProps['size']
  className?: string
}

export function AvatarGroup({ names, max = 4, size = 'sm', className }: AvatarGroupProps) {
  const shown = names.slice(0, max)
  const overflow = names.length - shown.length

  return (
    <div className={cn('flex items-center -space-x-2', className)}>
      {shown.map((name) => (
        <Avatar
          key={name}
          name={name}
          size={size}
          className="ring-2 ring-surface"
        />
      ))}

      {overflow > 0 ? (
        <span
          className={cn(
            'inline-flex items-center justify-center rounded-full bg-surface-sunken font-semibold text-muted ring-2 ring-surface',
            sizes[size],
          )}
        >
          +{overflow}
        </span>
      ) : null}
    </div>
  )
}
