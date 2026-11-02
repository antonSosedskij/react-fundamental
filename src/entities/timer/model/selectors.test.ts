import { describe, expect, it } from 'vitest'
import type { TimerSettings } from '@/entities/settings/@x/timer'
import {
  getModeDurationMs,
  getNextMode,
  getPomodoroNumber,
  getProgress,
  getRemainingMs,
} from './selectors'
import type { TimerState } from './types'

const MIN = 60_000
const NOW = 1_700_000_000_000

const settings: TimerSettings = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartFocus: false,
}

function makeState(overrides: Partial<TimerState> = {}): TimerState {
  return {
    mode: 'focus',
    status: 'idle',
    endsAt: null,
    remainingMs: 25 * MIN,
    completedFocusCount: 0,
    settings,
    ...overrides,
  }
}

describe('getModeDurationMs', () => {
  it.each([
    ['focus', 25 * MIN],
    ['shortBreak', 5 * MIN],
    ['longBreak', 15 * MIN],
  ] as const)('%s -> %i ms', (mode, expected) => {
    expect(getModeDurationMs(mode, settings)).toBe(expected)
  })
})

describe('getNextMode', () => {
  it.each(['shortBreak', 'longBreak'] as const)('%s -> focus', (mode) => {
    expect(getNextMode(makeState({ mode }), 'complete')).toBe('focus')
    expect(getNextMode(makeState({ mode }), 'skip')).toBe('focus')
  })

  it.each([
    [0, 'shortBreak'],
    [2, 'shortBreak'],
    [3, 'longBreak'],
    [4, 'shortBreak'],
    [7, 'longBreak'],
  ] as const)('focus completed with %i done before -> %s', (count, expected) => {
    expect(getNextMode(makeState({ completedFocusCount: count }), 'complete')).toBe(expected)
  })

  it('focus skipped -> always shortBreak', () => {
    expect(getNextMode(makeState({ completedFocusCount: 0 }), 'skip')).toBe('shortBreak')
    expect(getNextMode(makeState({ completedFocusCount: 3 }), 'skip')).toBe('shortBreak')
  })
})

describe('getRemainingMs', () => {
  it('idle -> remainingMs', () => {
    expect(getRemainingMs(makeState({ remainingMs: 7 * MIN }), NOW)).toBe(7 * MIN)
  })

  it('paused -> remainingMs, ignores now', () => {
    const state = makeState({ status: 'paused', remainingMs: 7 * MIN })
    expect(getRemainingMs(state, NOW + 100 * MIN)).toBe(7 * MIN)
  })

  it('running -> endsAt - now', () => {
    const state = makeState({ status: 'running', endsAt: NOW + 90_000 })
    expect(getRemainingMs(state, NOW)).toBe(90_000)
  })

  it('running past endsAt -> 0', () => {
    const state = makeState({ status: 'running', endsAt: NOW })
    expect(getRemainingMs(state, NOW + 5000)).toBe(0)
  })
})

describe('getProgress', () => {
  it('not started -> 0', () => {
    expect(getProgress(makeState(), NOW)).toBe(0)
  })

  it('half of the interval -> 0.5', () => {
    const state = makeState({ mode: 'shortBreak', status: 'running', endsAt: NOW + 2.5 * MIN })
    expect(getProgress(state, NOW)).toBeCloseTo(0.5)
  })

  it('paused at 20 of 25 minutes -> 0.8', () => {
    const state = makeState({ status: 'paused', remainingMs: 5 * MIN })
    expect(getProgress(state, NOW)).toBeCloseTo(0.8)
  })

  it('finished -> 1, never more', () => {
    const state = makeState({ status: 'running', endsAt: NOW - MIN })
    expect(getProgress(state, NOW)).toBe(1)
  })
})

describe('getPomodoroNumber', () => {
  it.each([
    ['focus', 0, 1],
    ['focus', 4, 5],
    ['shortBreak', 1, 1],
    ['longBreak', 4, 4],
  ] as const)('%s with %i completed -> #%i', (mode, count, expected) => {
    expect(getPomodoroNumber(makeState({ mode, completedFocusCount: count }))).toBe(expected)
  })
})
