import { createContext, useContext } from 'react'
import type { Settings } from './types'

export interface SettingsContextValue {
  settings: Settings
  updateSettings: (next: Settings) => void
}

/** The provider lives in app/providers; features read it through useSettings. */
export const SettingsContext = createContext<SettingsContextValue | null>(null)

/** Throws if used outside SettingsProvider. Stage 6. */
export function useSettings(): SettingsContextValue {
  const settings = useContext(SettingsContext)

  if (!settings) {
    throw new Error('Attemped access to context outside provider')
  }

  return settings
}
