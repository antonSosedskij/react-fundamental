import { useEffect, useState } from 'react'

/**
 * Current Date.now(), refreshed every `intervalMs` while `enabled` is true.
 * Stage 3: interval + cleanup.
 */
export function useNow(enabled: boolean, intervalMs = 250): number {
  const [now, setNow] = useState(Date.now)

  useEffect(() => {
    if (enabled) {
      const interval = setInterval(() => {
        setNow(Date.now())
      }, intervalMs)

      return () => {
        clearInterval(interval)
      }
    }
  }, [enabled, intervalMs])

  return now
}
