import type { TimerSettings } from '@/entities/settings/@x/timer'

export type Mode = 'focus' | 'shortBreak' | 'longBreak'
export type Status = 'idle' | 'running' | 'paused'

export interface TimerState {
  mode: Mode
  status: Status
  /** End timestamp (ms) while running, otherwise null. */
  endsAt: number | null
  /** Time left while idle or paused. Not meaningful while running. */
  remainingMs: number
  /** Completed (not skipped) focus intervals. Drives the long-break rule. */
  completedFocusCount: number
  /** Snapshot of the settings the timer currently uses. */
  settings: TimerSettings
}

/** Current time always comes in the action, so the reducer stays pure. */
export type TimerAction =
  | { type: 'START'; now: number }
  | { type: 'PAUSE'; now: number }
  | { type: 'RESET' }
  | { type: 'COMPLETE'; now: number }
  | { type: 'SKIP' }
  | { type: 'SWITCH_MODE'; mode: Mode }
  | { type: 'APPLY_SETTINGS'; settings: TimerSettings }

export type ActionType = TimerAction['type']
export type ActionOf<K extends ActionType> = Extract<TimerAction, { type: K }>

export type TimerActionHandlers = {
  [K in ActionType]: (state: TimerState, action: ActionOf<K>) => TimerState
}
