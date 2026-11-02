import { HomePage } from '@/pages/home'
import { SessionsProvider } from './providers/SessionsProvider'
import { SettingsProvider } from './providers/SettingsProvider'

export function App() {
  return (
    <SettingsProvider>
      <SessionsProvider>
        <HomePage />
      </SessionsProvider>
    </SettingsProvider>
  )
}
