import type { Settings } from './types'

export const DEFAULT_SETTINGS: Settings = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartFocus: false,
  soundEnabled: true,
}

/** Validation limits for the settings form. */
export const SETTINGS_LIMITS = {
  minutes: { min: 1, max: 90 },
  longBreakInterval: { min: 2, max: 10 },
} as const

export const SETTINGS_STORAGE_KEY = 'pomodoro:settings'
