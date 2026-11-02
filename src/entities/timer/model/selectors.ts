import type { TimerSettings } from '@/entities/settings/@x/timer'
import type { Mode, TimerState } from './types'

/** Full length of a mode in ms. */
export function getModeDurationMs(_mode: Mode, _settings: TimerSettings): number {
  throw new Error('Not implemented')
}

/**
 * Mode that follows the current one.
 * - any break -> focus;
 * - focus, 'complete' -> longBreak if (completedFocusCount + 1) is a multiple of
 *   longBreakInterval, otherwise shortBreak (the count in state is before the increment);
 * - focus, 'skip' -> always shortBreak.
 */
export function getNextMode(_state: TimerState, _reason: 'complete' | 'skip'): Mode {
  throw new Error('Not implemented')
}

/** Time left: endsAt - now while running (never below 0), otherwise remainingMs. */
export function getRemainingMs(_state: TimerState, _now: number): number {
  throw new Error('Not implemented')
}

/** Progress of the current interval, from 0 to 1. */
export function getProgress(_state: TimerState, _now: number): number {
  throw new Error('Not implemented')
}

/**
 * Number of the current pomodoro for the UI ("#3").
 * Focus: completedFocusCount + 1. Break: completedFocusCount (the break belongs to
 * the focus that just ended).
 */
export function getPomodoroNumber(_state: TimerState): number {
  throw new Error('Not implemented')
}
