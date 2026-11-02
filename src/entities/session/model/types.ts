/** One completed focus interval. Skipped intervals are never recorded. */
export interface Session {
  id: string
  /** When the interval ended: the timer's endsAt, not the moment COMPLETE ran. */
  endedAt: number
  durationMs: number
}

export interface TodayStats {
  count: number
  focusMinutes: number
}

export interface DayStats {
  /** Local date, "YYYY-MM-DD". */
  date: string
  count: number
  focusMinutes: number
}
