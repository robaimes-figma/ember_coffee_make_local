import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

/**
 * Light / dark mode.
 *
 * Adds or removes `.dark` on <html>, which is the hook the design system's
 * dark tokens hang off. Light is the default; see `initialMode` below.
 */

type Mode = 'light' | 'dark'

interface ThemeContextValue {
  mode: Mode
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const STORAGE_KEY = 'ember.theme.v1'

/**
 * Light is the default.
 *
 * Deliberately does *not* fall back to `prefers-color-scheme`. The cream
 * surfaces are the brand, and someone opening the storefront for the first
 * time on a machine set to dark should still see it the way it is designed.
 * Dark mode is opt-in via the toggle, and an explicit choice is remembered.
 */
function initialMode(): Mode {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return 'light'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>(initialMode)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark')
    document.documentElement.style.colorScheme = mode
    localStorage.setItem(STORAGE_KEY, mode)
  }, [mode])

  const toggle = useCallback(() => {
    setMode((current) => (current === 'light' ? 'dark' : 'light'))
  }, [])

  return <ThemeContext.Provider value={{ mode, toggle }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used inside <ThemeProvider>')
  return context
}
