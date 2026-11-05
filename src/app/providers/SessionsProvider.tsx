import { SESSIONS_STORAGE_KEY, SessionsContext, type Session } from '@/entities/session'
import { useLocalStorage } from '@/shared/lib'
import type { PropsWithChildren } from 'react'

// Module-level, so the fallback is the same array on every render, not a new [] each time.
const NO_SESSIONS: Session[] = []

export function SessionsProvider({ children }: PropsWithChildren) {
  const [sessions, setSessions] = useLocalStorage(SESSIONS_STORAGE_KEY, NO_SESSIONS)

  const addSession = (session: Omit<Session, 'id'>) => {
    // Updater form: reads the latest list from storage, not this render's snapshot.
    setSessions((prev) => [...prev, { ...session, id: crypto.randomUUID() }])
  }

  return <SessionsContext value={{ sessions, addSession }}>{children}</SessionsContext>
}
