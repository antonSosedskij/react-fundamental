export interface TimerHotkeyHandlers {
  /** Space */
  onToggle: () => void
  /** R */
  onReset: () => void
  /** S */
  onSkip: () => void
}

/** Listens on window. Ignores keys while focus is in input, textarea, select or contenteditable. Stage 8. */
export function useTimerHotkeys(_handlers: TimerHotkeyHandlers): void {
  throw new Error('Not implemented')
}
