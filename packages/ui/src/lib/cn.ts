import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind classes, with later classes winning conflicts.
 *
 * Every component in this library takes a `className` prop and passes it
 * through `cn` last, so a caller can always override a component's own
 * styling without editing the component.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
