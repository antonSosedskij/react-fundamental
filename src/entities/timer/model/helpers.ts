import type { TimerSettings } from '@/entities/settings/@x/timer'
import { getModeDurationMs, getNextMode } from './selectors'
import type { Mode, TimerActionHandlers, TimerState } from './types'

/** The given mode, stopped, with its full duration. */
function idleIn(
  state: TimerState,
  mode: Mode,
  settings: TimerSettings = state.settings,
): TimerState {
  return {
    ...state,
    mode,
    settings,
    status: 'idle',
    endsAt: null,
    remainingMs: getModeDurationMs(mode, settings),
  }
}

export const timerActionHandlers: TimerActionHandlers = {
  START: (state, action) => {
    if (state.status === 'running') {
      return state
    }

    return {
      ...state,
      status: 'running',
      endsAt: action.now + state.remainingMs,
    }
  },

  PAUSE: (state, action) => {
    if (state.status !== 'running' || state.endsAt === null) {
      return state
    }

    return {
      ...state,
      status: 'paused',
      remainingMs: Math.max(0, state.endsAt - action.now),
      endsAt: null,
    }
  },

  RESET: (state) => idleIn(state, state.mode),

  COMPLETE: (state, action) => {
    if (state.status !== 'running') {
      return state
    }

    const nextMode = getNextMode(state, 'complete')
    const next: TimerState = {
      ...idleIn(state, nextMode),
      completedFocusCount:
        state.mode === 'focus' ? state.completedFocusCount + 1 : state.completedFocusCount,
    }

    const autoStart =
      nextMode === 'focus' ? state.settings.autoStartFocus : state.settings.autoStartBreaks

    if (!autoStart) {
      return next
    }

    return {
      ...next,
      status: 'running',
      endsAt: action.now + next.remainingMs,
    }
  },

  SKIP: (state) => idleIn(state, getNextMode(state, 'skip')),

  SWITCH_MODE: (state, action) => idleIn(state, action.mode),

  APPLY_SETTINGS: (state, action) => {
    // A running or paused interval keeps its time; new durations apply from the next one.
    if (state.status !== 'idle') {
      return { ...state, settings: action.settings }
    }

    return idleIn(state, state.mode, action.settings)
  },
}
