import { useEffect } from 'react'

/** Keeps document.title equal to `title`. Stage 4. */
export function useDocumentTitle(title: string): void {
  useEffect(() => {
    const prevTitle = document.title

    document.title = title

    return () => {
      document.title = prevTitle
    }
  }, [title])
}
