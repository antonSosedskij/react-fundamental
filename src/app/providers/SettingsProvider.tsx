import { DEFAULT_SETTINGS, SETTINGS_STORAGE_KEY, SettingsContext } from '@/entities/settings'
import { useLocalStorage } from '@/shared/lib'
import type { PropsWithChildren } from 'react'

export function SettingsProvider({ children }: PropsWithChildren) {
  const [settings, updateSettings] = useLocalStorage(SETTINGS_STORAGE_KEY, DEFAULT_SETTINGS)

  return <SettingsContext value={{ settings, updateSettings }}>{children}</SettingsContext>
}
