import { useSyncExternalStore } from 'react'

type SetValue<T> = (value: T | ((prev: T) => T)) => void

const subscribe = (callback: () => void) => {
  window.addEventListener('storage', callback)

  return () => {
    window.removeEventListener('storage', callback)
  }
}

const parse = <T>(raw: string | null, fallback: T): T => {
  if (!raw) {
    return fallback
  }
  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

/**
 * State synced with localStorage under `key`.
 * Falls back to `initialValue` when the key is missing or holds invalid JSON.
 * Stage 6. Hint: look at useSyncExternalStore to stay in sync across tabs.
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>] {
  const snapshot = () => {
    return localStorage.getItem(key)
  }

  const storageString = useSyncExternalStore(subscribe, snapshot)

  const storageState = parse(storageString, initialValue)

  const setStorageState: SetValue<T> = (value: T | ((prev: T) => T)) => {
    const currentValue = parse(localStorage.getItem(key), initialValue)
    const newValue = value instanceof Function ? value(currentValue) : value

    localStorage.setItem(key, JSON.stringify(newValue))

    window.dispatchEvent(new Event('storage'))
  }

  return [storageState, setStorageState]
}
