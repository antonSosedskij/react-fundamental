import type { DayStats, Session, TodayStats } from './types'

// All days are local calendar days. focusMinutes = Math.round(total ms / 60 000).

/** Pomodoros and focus minutes for the calendar day that contains `now`. */
export function getTodayStats(_sessions: Session[], _now: number): TodayStats {
  throw new Error('Not implemented')
}

/** Last `days` days including today, oldest first, empty days included as zeros. */
export function getLastDaysStats(_sessions: Session[], _now: number, _days = 7): DayStats[] {
  throw new Error('Not implemented')
}

/**
 * Consecutive days with at least one session, ending today.
 * If today has none yet, the streak ends yesterday (it is not broken until the day is over).
 */
export function getStreak(_sessions: Session[], _now: number): number {
  throw new Error('Not implemented')
}
