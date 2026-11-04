import type { TimerSettings } from '@/entities/settings/@x/timer'
import { timerActionHandlers } from './helpers'
import { getModeDurationMs } from './selectors'
import type { TimerAction, TimerState } from './types'

type AnyActionHandler = (state: TimerState, action: TimerAction) => TimerState

/** Initial state for useReducer: focus, idle, full duration, zero completed. */
export function createInitialTimerState(settings: TimerSettings): TimerState {
  return {
    mode: 'focus',
    status: 'idle',
    endsAt: null,
    remainingMs: getModeDurationMs('focus', settings),
    completedFocusCount: 0,
    settings,
  }
}

/**
 * Pure reducer, no Date.now() inside. An action from a status where it is not
 * allowed returns the very same state object.
 */
export function timerReducer(state: TimerState, action: TimerAction): TimerState {
  const handler = timerActionHandlers[action.type] as AnyActionHandler

  return handler(state, action)
}
