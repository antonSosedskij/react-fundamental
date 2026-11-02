import type { PropsWithChildren } from 'react'

/** Stage 7: SessionsContext.Provider + useLocalStorage. For now it only passes children through. */
export function SessionsProvider({ children }: PropsWithChildren) {
  return children
}
