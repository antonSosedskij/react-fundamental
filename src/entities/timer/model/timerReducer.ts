import type { TimerSettings } from '@/entities/settings/@x/timer'
import type { TimerAction, TimerState } from './types'

/** Initial state for useReducer: focus, idle, full duration, zero completed. */
export function createInitialTimerState(_settings: TimerSettings): TimerState {
  throw new Error('Not implemented')
}

/**
 * Pure reducer, no Date.now() inside. An action from a status where it is not
 * allowed returns the very same state object.
 */
export function timerReducer(_state: TimerState, _action: TimerAction): TimerState {
  throw new Error('Not implemented')
}
