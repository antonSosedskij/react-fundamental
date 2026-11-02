import { describe, expect, it } from 'vitest'
import { getLastDaysStats, getStreak, getTodayStats } from './stats'
import type { Session } from './types'

// Tests run with TZ=UTC (see vite.config.ts), so local days are UTC days here.
const MIN = 60_000

/** Monday, 2 Nov 2026, 15:00. */
const NOW = Date.UTC(2026, 10, 2, 15, 0)

let nextId = 0
function session(endedAt: number, minutes = 25): Session {
  nextId += 1
  return { id: String(nextId), endedAt, durationMs: minutes * MIN }
}

/** Timestamp `daysAgo` days before 2 Nov 2026 at the given time. */
function at(daysAgo: number, hours = 12, minutes = 0): number {
  return Date.UTC(2026, 10, 2 - daysAgo, hours, minutes)
}

describe('getTodayStats', () => {
  it('no sessions -> zeros', () => {
    expect(getTodayStats([], NOW)).toEqual({ count: 0, focusMinutes: 0 })
  })

  it('counts only today', () => {
    const sessions = [session(at(0, 9)), session(at(0, 14, 30)), session(at(1, 18))]
    expect(getTodayStats(sessions, NOW)).toEqual({ count: 2, focusMinutes: 50 })
  })

  it('sums different durations', () => {
    const sessions = [session(at(0, 9), 25), session(at(0, 10), 50)]
    expect(getTodayStats(sessions, NOW).focusMinutes).toBe(75)
  })

  it('day boundaries: 00:00 is today, 23:59:59.999 yesterday is not', () => {
    const sessions = [
      session(Date.UTC(2026, 10, 2, 0, 0, 0, 0)),
      session(Date.UTC(2026, 10, 1, 23, 59, 59, 999)),
    ]
    expect(getTodayStats(sessions, NOW).count).toBe(1)
  })

  it('rounds focus minutes', () => {
    const sessions = [{ id: 'x', endedAt: at(0, 9), durationMs: 25 * MIN + 40_000 }]
    expect(getTodayStats(sessions, NOW).focusMinutes).toBe(26)
  })
})

describe('getLastDaysStats', () => {
  it('returns 7 days, oldest first, empty days as zeros', () => {
    expect(getLastDaysStats([], NOW)).toEqual([
      { date: '2026-10-27', count: 0, focusMinutes: 0 },
      { date: '2026-10-28', count: 0, focusMinutes: 0 },
      { date: '2026-10-29', count: 0, focusMinutes: 0 },
      { date: '2026-10-30', count: 0, focusMinutes: 0 },
      { date: '2026-10-31', count: 0, focusMinutes: 0 },
      { date: '2026-11-01', count: 0, focusMinutes: 0 },
      { date: '2026-11-02', count: 0, focusMinutes: 0 },
    ])
  })

  it('aggregates by day and ignores older sessions', () => {
    const sessions = [
      session(at(0, 9)),
      session(at(0, 11)),
      session(at(3, 20), 50),
      session(at(7, 12)), // 8th day back, out of range
    ]
    const days = getLastDaysStats(sessions, NOW)
    expect(days).toHaveLength(7)
    expect(days[6]).toEqual({ date: '2026-11-02', count: 2, focusMinutes: 50 })
    expect(days[3]).toEqual({ date: '2026-10-30', count: 1, focusMinutes: 50 })
    expect(days[0]).toEqual({ date: '2026-10-27', count: 0, focusMinutes: 0 })
  })

  it('supports a custom number of days', () => {
    const days = getLastDaysStats([], NOW, 3)
    expect(days.map((d) => d.date)).toEqual(['2026-10-31', '2026-11-01', '2026-11-02'])
  })

  it('does not depend on the order of sessions', () => {
    const a = [session(at(0)), session(at(2)), session(at(1))]
    const b = [...a].reverse()
    expect(getLastDaysStats(a, NOW)).toEqual(getLastDaysStats(b, NOW))
  })
})

describe('getStreak', () => {
  it('no sessions -> 0', () => {
    expect(getStreak([], NOW)).toBe(0)
  })

  it('only today -> 1', () => {
    expect(getStreak([session(at(0))], NOW)).toBe(1)
  })

  it('today and two days before -> 3', () => {
    expect(getStreak([session(at(0)), session(at(1)), session(at(2))], NOW)).toBe(3)
  })

  it('several sessions on one day count as one day', () => {
    const sessions = [session(at(0, 9)), session(at(0, 10)), session(at(0, 11)), session(at(1))]
    expect(getStreak(sessions, NOW)).toBe(2)
  })

  it('a gap ends the streak', () => {
    expect(getStreak([session(at(0)), session(at(1)), session(at(3))], NOW)).toBe(2)
  })

  it('nothing today yet: streak ends yesterday', () => {
    expect(getStreak([session(at(1)), session(at(2))], NOW)).toBe(2)
  })

  it('last session two days ago -> 0', () => {
    expect(getStreak([session(at(2)), session(at(3))], NOW)).toBe(0)
  })

  it('works across a month boundary', () => {
    const sessions = [session(at(0)), session(at(1)), session(at(2))] // 2 Nov, 1 Nov, 31 Oct
    expect(getStreak(sessions, NOW)).toBe(3)
  })
})
