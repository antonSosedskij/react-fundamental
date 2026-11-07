import type { TimerHotkeyHandlers } from './useTimerHotkeys'

export type Hotkeys = 'Space' | 'KeyR' | 'KeyS'

export type Keymap = Record<Hotkeys, () => void>

export const getKeyMap = (handlers: TimerHotkeyHandlers): Keymap => ({
  Space: handlers.onToggle,
  KeyR: handlers.onReset,
  KeyS: handlers.onSkip,
})

export const isHotkeyCode = (code: string, map: Keymap): code is Hotkeys => {
  return code in map
}

const EDITABLE_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT'])

/** True when the key press is meant for a form field, so hotkeys must stay out of the way. */
export const isEditableTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) return false

  return EDITABLE_TAGS.has(target.tagName) || target.isContentEditable
}
