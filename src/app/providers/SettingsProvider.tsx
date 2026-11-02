import type { PropsWithChildren } from 'react'

/** Stage 6: SettingsContext.Provider + useLocalStorage. For now it only passes children through. */
export function SettingsProvider({ children }: PropsWithChildren) {
  return children
}
