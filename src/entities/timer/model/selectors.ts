import type { TimerSettings } from '@/entities/settings/@x/timer'
import type { Mode, TimerState } from './types'

const MINUTE_MS = 60_000

/** Full length of a mode in ms. */
export function getModeDurationMs(mode: Mode, settings: TimerSettings): number {
  const minutes: Record<Mode, number> = {
    focus: settings.focusMinutes,
    shortBreak: settings.shortBreakMinutes,
    longBreak: settings.longBreakMinutes,
  }
  return minutes[mode] * MINUTE_MS
}

/**
 * Mode that follows the current one.
 * - any break -> focus;
 * - focus, 'complete' -> longBreak if (completedFocusCount + 1) is a multiple of
 *   longBreakInterval, otherwise shortBreak (the count in state is before the increment);
 * - focus, 'skip' -> always shortBreak.
 */
export function getNextMode(state: TimerState, reason: 'complete' | 'skip'): Mode {
  if (state.mode !== 'focus') return 'focus'
  if (reason === 'skip') return 'shortBreak'

  const isLongBreakDue = (state.completedFocusCount + 1) % state.settings.longBreakInterval === 0
  return isLongBreakDue ? 'longBreak' : 'shortBreak'
}

/** Time left: endsAt - now while running (never below 0), otherwise remainingMs. */
export function getRemainingMs(state: TimerState, now: number): number {
  if (state.status === 'running' && state.endsAt !== null) {
    return Math.max(0, state.endsAt - now)
  }
  return state.remainingMs
}

/** Progress of the current interval, from 0 to 1. */
export function getProgress(state: TimerState, now: number): number {
  const totalMs = getModeDurationMs(state.mode, state.settings)
  if (totalMs <= 0) return 0

  const progress = 1 - getRemainingMs(state, now) / totalMs
  return Math.min(1, Math.max(0, progress))
}

/**
 * Number of the current pomodoro for the UI ("#3").
 * Focus: completedFocusCount + 1. Break: completedFocusCount (the break belongs to
 * the focus that just ended).
 */
export function getPomodoroNumber(state: TimerState): number {
  return state.mode === 'focus' ? state.completedFocusCount + 1 : state.completedFocusCount
}
