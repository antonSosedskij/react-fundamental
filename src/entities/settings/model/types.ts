/** What the timer reducer needs. A snapshot of it lives in TimerState. */
export interface TimerSettings {
  focusMinutes: number
  shortBreakMinutes: number
  longBreakMinutes: number
  /** Long break after every N-th completed focus. */
  longBreakInterval: number
  autoStartBreaks: boolean
  autoStartFocus: boolean
}

/** Everything the user can configure. */
export interface Settings extends TimerSettings {
  soundEnabled: boolean
}
