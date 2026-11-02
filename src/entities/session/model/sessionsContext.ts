import { createContext } from 'react'
import type { Session } from './types'

export interface SessionsContextValue {
  sessions: Session[]
  addSession: (session: Omit<Session, 'id'>) => void
}

/** Shared by timer-panel (writes) and stats-panel (reads). Provider lives in app/providers. */
export const SessionsContext = createContext<SessionsContextValue | null>(null)

/** Throws if used outside SessionsProvider. Stage 7. */
export function useSessions(): SessionsContextValue {
  throw new Error('Not implemented')
}
