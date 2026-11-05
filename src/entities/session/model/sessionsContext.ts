import { createContext, useContext } from 'react'
import type { Session } from './types'

export interface SessionsContextValue {
  sessions: Session[]
  addSession: (session: Omit<Session, 'id'>) => void
}

/** Shared by timer-panel (writes) and stats-panel (reads). Provider lives in app/providers. */
export const SessionsContext = createContext<SessionsContextValue | null>(null)

/** Throws if used outside SessionsProvider. */
export function useSessions(): SessionsContextValue {
  const context = useContext(SessionsContext)

  if (!context) {
    throw new Error('useSessions must be used inside SessionsProvider')
  }

  return context
}
