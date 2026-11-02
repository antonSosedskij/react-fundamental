type SetValue<T> = (value: T | ((prev: T) => T)) => void

/**
 * State synced with localStorage under `key`.
 * Falls back to `initialValue` when the key is missing or holds invalid JSON.
 * Stage 6. Hint: look at useSyncExternalStore to stay in sync across tabs.
 */
export function useLocalStorage<T>(_key: string, _initialValue: T): [T, SetValue<T>] {
  throw new Error('Not implemented')
}
