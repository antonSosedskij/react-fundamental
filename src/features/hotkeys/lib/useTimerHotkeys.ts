import { useEffect, useEffectEvent } from 'react'
import { getKeyMap, isEditableTarget, isHotkeyCode } from './keyMap'

export interface TimerHotkeyHandlers {
  onToggle: () => void
  onReset: () => void
  onSkip: () => void
}

/** Listens on window. Ignores keys while focus is in input, textarea, select or contenteditable. Stage 8. */
export function useTimerHotkeys(handlers: TimerHotkeyHandlers): void {
  const keydownHandler = useEffectEvent((event: KeyboardEvent) => {
    if (isEditableTarget(event.target)) {
      return
    }

    if (event.repeat || event.ctrlKey || event.metaKey || event.altKey) {
      return
    }

    const keymap = getKeyMap(handlers)

    if (!isHotkeyCode(event.code, keymap)) {
      return
    }

    event.preventDefault()
    keymap[event.code]()
  })

  useEffect(() => {
    window.addEventListener('keydown', keydownHandler)

    return () => {
      window.removeEventListener('keydown', keydownHandler)
    }
  }, [])
}
