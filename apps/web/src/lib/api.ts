import { useCallback, useEffect, useState } from 'react'

/**
 * Minimal data fetching.
 *
 * Deliberately not React Query. This app has a dozen endpoints and no cache
 * invalidation story worth speaking of, and a designer opening this file to
 * understand where a loading state comes from should be able to read the
 * whole mechanism in one screen.
 */

const BASE = '/api'

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE}${path}`)

  if (!response.ok) {
    throw new Error(`GET ${path} failed with ${response.status}`)
  }

  return (await response.json()) as T
}

export async function apiSend<T>(
  path: string,
  method: 'POST' | 'PATCH',
  body: unknown,
): Promise<T> {
  const response = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error(`${method} ${path} failed with ${response.status}`)
  }

  return (await response.json()) as T
}

export interface QueryState<T> {
  data: T | undefined
  loading: boolean
  error: Error | undefined
  refetch: () => void
}

/**
 * Fetch on mount and whenever `path` changes.
 *
 * The three states are always distinguishable — `loading`, `error`, and data
 * present — because every page in this app is expected to render all three.
 */
export function useQuery<T>(path: string): QueryState<T> {
  const [data, setData] = useState<T>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error>()
  const [nonce, setNonce] = useState(0)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(undefined)

    apiGet<T>(path)
      .then((result) => {
        if (cancelled) return
        setData(result)
      })
      .catch((cause: Error) => {
        if (cancelled) return
        setError(cause)
      })
      .finally(() => {
        if (cancelled) return
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [path, nonce])

  const refetch = useCallback(() => setNonce((value) => value + 1), [])

  return { data, loading, error, refetch }
}
