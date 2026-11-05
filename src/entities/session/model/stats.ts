import type { DayStats, Session, TodayStats } from './types'

// All days are local calendar days. focusMinutes = Math.round(total ms / 60 000).

const MINUTE_MS = 60_000

/** Local calendar day as "YYYY-MM-DD". */
function toDayKey(timestamp: number): string {
  const date = new Date(timestamp)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

/** Day key `offset` calendar days from `now`. Goes through Date, so month ends and DST are handled. */
function shiftDayKey(now: number, offset: number): string {
  const date = new Date(now)
  date.setDate(date.getDate() + offset)
  return toDayKey(date.getTime())
}

/** Total focus ms and count for every day that has sessions. */
function groupByDay(sessions: Session[]): Map<string, { count: number; durationMs: number }> {
  const days = new Map<string, { count: number; durationMs: number }>()

  for (const { endedAt, durationMs } of sessions) {
    const key = toDayKey(endedAt)
    const day = days.get(key) ?? { count: 0, durationMs: 0 }
    days.set(key, { count: day.count + 1, durationMs: day.durationMs + durationMs })
  }

  return days
}

/** Pomodoros and focus minutes for the calendar day that contains `now`. */
export function getTodayStats(sessions: Session[], now: number): TodayStats {
  const today = groupByDay(sessions).get(toDayKey(now))

  return {
    count: today?.count ?? 0,
    focusMinutes: Math.round((today?.durationMs ?? 0) / MINUTE_MS),
  }
}

/** Last `days` days including today, oldest first, empty days included as zeros. */
export function getLastDaysStats(sessions: Session[], now: number, days = 7): DayStats[] {
  const byDay = groupByDay(sessions)

  return Array.from({ length: days }, (_, index) => {
    const date = shiftDayKey(now, index - (days - 1))
    const day = byDay.get(date)

    return {
      date,
      count: day?.count ?? 0,
      focusMinutes: Math.round((day?.durationMs ?? 0) / MINUTE_MS),
    }
  })
}

/**
 * Consecutive days with at least one session, ending today.
 * If today has none yet, the streak ends yesterday (it is not broken until the day is over).
 */
export function getStreak(sessions: Session[], now: number): number {
  const activeDays = new Set(sessions.map((session) => toDayKey(session.endedAt)))

  let offset = activeDays.has(toDayKey(now)) ? 0 : -1
  let streak = 0

  while (activeDays.has(shiftDayKey(now, offset))) {
    streak += 1
    offset -= 1
  }

  return streak
}
