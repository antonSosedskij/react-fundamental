import { describe, expect, it } from 'vitest'
import type { TimerSettings } from '@/entities/settings/@x/timer'
import { createInitialTimerState, timerReducer } from './timerReducer'
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

function running(overrides: Partial<TimerState> = {}): TimerState {
  return makeState({ status: 'running', endsAt: NOW, ...overrides })
}

describe('createInitialTimerState', () => {
  it('starts in focus, idle, with full focus duration', () => {
    expect(createInitialTimerState(settings)).toEqual({
      mode: 'focus',
      status: 'idle',
      endsAt: null,
      remainingMs: 25 * MIN,
      completedFocusCount: 0,
      settings,
    })
  })

  it('uses durations from the given settings', () => {
    const state = createInitialTimerState({ ...settings, focusMinutes: 50 })
    expect(state.remainingMs).toBe(50 * MIN)
  })
})

describe('START', () => {
  it('idle -> running, endsAt = now + remainingMs', () => {
    const next = timerReducer(makeState(), { type: 'START', now: NOW })
    expect(next.status).toBe('running')
    expect(next.endsAt).toBe(NOW + 25 * MIN)
  })

  it('paused -> running from the remaining time', () => {
    const state = makeState({ status: 'paused', remainingMs: 10 * MIN })
    const next = timerReducer(state, { type: 'START', now: NOW })
    expect(next.status).toBe('running')
    expect(next.endsAt).toBe(NOW + 10 * MIN)
  })

  it('does not mutate the previous state', () => {
    const state = makeState()
    const snapshot = structuredClone(state)
    timerReducer(state, { type: 'START', now: NOW })
    expect(state).toEqual(snapshot)
  })

  it('is ignored while running (same object)', () => {
    const state = running({ endsAt: NOW + 5 * MIN })
    expect(timerReducer(state, { type: 'START', now: NOW })).toBe(state)
  })
})

describe('PAUSE', () => {
  it('running -> paused, remainingMs = endsAt - now, endsAt = null', () => {
    const state = running({ endsAt: NOW + 10 * MIN })
    const next = timerReducer(state, { type: 'PAUSE', now: NOW })
    expect(next.status).toBe('paused')
    expect(next.remainingMs).toBe(10 * MIN)
    expect(next.endsAt).toBeNull()
  })

  it('never stores negative remaining time', () => {
    const state = running({ endsAt: NOW - 1000 })
    expect(timerReducer(state, { type: 'PAUSE', now: NOW }).remainingMs).toBe(0)
  })

  it('pause + start does not lose or add time', () => {
    let state = timerReducer(makeState(), { type: 'START', now: NOW })
    state = timerReducer(state, { type: 'PAUSE', now: NOW + 7 * MIN })
    state = timerReducer(state, { type: 'START', now: NOW + 60 * MIN })
    expect(state.endsAt).toBe(NOW + 60 * MIN + 18 * MIN)
  })

  it.each(['idle', 'paused'] as const)('is ignored from %s (same object)', (status) => {
    const state = makeState({ status })
    expect(timerReducer(state, { type: 'PAUSE', now: NOW })).toBe(state)
  })
})

describe('RESET', () => {
  it('running -> idle with full duration of the current mode', () => {
    const state = running({ endsAt: NOW + 3 * MIN })
    const next = timerReducer(state, { type: 'RESET' })
    expect(next.status).toBe('idle')
    expect(next.endsAt).toBeNull()
    expect(next.remainingMs).toBe(25 * MIN)
  })

  it('paused -> idle with full duration', () => {
    const state = makeState({ status: 'paused', remainingMs: 2 * MIN })
    const next = timerReducer(state, { type: 'RESET' })
    expect(next.status).toBe('idle')
    expect(next.remainingMs).toBe(25 * MIN)
  })

  it('keeps the mode and the focus counter', () => {
    const state = makeState({
      mode: 'shortBreak',
      status: 'paused',
      remainingMs: MIN,
      completedFocusCount: 2,
    })
    const next = timerReducer(state, { type: 'RESET' })
    expect(next.mode).toBe('shortBreak')
    expect(next.remainingMs).toBe(5 * MIN)
    expect(next.completedFocusCount).toBe(2)
  })
})

describe('COMPLETE', () => {
  it('focus -> shortBreak (idle), counter + 1', () => {
    const next = timerReducer(running(), { type: 'COMPLETE', now: NOW })
    expect(next).toMatchObject({
      mode: 'shortBreak',
      status: 'idle',
      endsAt: null,
      remainingMs: 5 * MIN,
      completedFocusCount: 1,
    })
  })

  it('4th completed focus -> longBreak', () => {
    const next = timerReducer(running({ completedFocusCount: 3 }), { type: 'COMPLETE', now: NOW })
    expect(next.mode).toBe('longBreak')
    expect(next.remainingMs).toBe(15 * MIN)
    expect(next.completedFocusCount).toBe(4)
  })

  it('8th completed focus -> longBreak again', () => {
    const next = timerReducer(running({ completedFocusCount: 7 }), { type: 'COMPLETE', now: NOW })
    expect(next.mode).toBe('longBreak')
  })

  it('5th completed focus -> shortBreak', () => {
    const next = timerReducer(running({ completedFocusCount: 4 }), { type: 'COMPLETE', now: NOW })
    expect(next.mode).toBe('shortBreak')
  })

  it('respects longBreakInterval from settings', () => {
    const state = running({
      completedFocusCount: 1,
      settings: { ...settings, longBreakInterval: 2 },
    })
    expect(timerReducer(state, { type: 'COMPLETE', now: NOW }).mode).toBe('longBreak')
  })

  it.each(['shortBreak', 'longBreak'] as const)('%s -> focus, counter unchanged', (mode) => {
    const next = timerReducer(running({ mode, completedFocusCount: 4 }), {
      type: 'COMPLETE',
      now: NOW,
    })
    expect(next).toMatchObject({
      mode: 'focus',
      status: 'idle',
      remainingMs: 25 * MIN,
      completedFocusCount: 4,
    })
  })

  it('autoStartBreaks: focus -> break starts running from now', () => {
    const state = running({ settings: { ...settings, autoStartBreaks: true } })
    const next = timerReducer(state, { type: 'COMPLETE', now: NOW + 500 })
    expect(next.mode).toBe('shortBreak')
    expect(next.status).toBe('running')
    expect(next.endsAt).toBe(NOW + 500 + 5 * MIN)
  })

  it('autoStartBreaks does not autostart focus', () => {
    const state = running({ mode: 'shortBreak', settings: { ...settings, autoStartBreaks: true } })
    const next = timerReducer(state, { type: 'COMPLETE', now: NOW })
    expect(next.mode).toBe('focus')
    expect(next.status).toBe('idle')
    expect(next.endsAt).toBeNull()
  })

  it('autoStartFocus: break -> focus starts running from now', () => {
    const state = running({ mode: 'longBreak', settings: { ...settings, autoStartFocus: true } })
    const next = timerReducer(state, { type: 'COMPLETE', now: NOW })
    expect(next.mode).toBe('focus')
    expect(next.status).toBe('running')
    expect(next.endsAt).toBe(NOW + 25 * MIN)
  })

  it('autoStartFocus does not autostart breaks', () => {
    const state = running({ settings: { ...settings, autoStartFocus: true } })
    expect(timerReducer(state, { type: 'COMPLETE', now: NOW }).status).toBe('idle')
  })

  it.each(['idle', 'paused'] as const)('is ignored from %s (same object)', (status) => {
    const state = makeState({ status })
    expect(timerReducer(state, { type: 'COMPLETE', now: NOW })).toBe(state)
  })

  it('full cycle: 4 focuses -> long break, then focus again', () => {
    let state = makeState()
    const modes: string[] = []
    for (let i = 0; i < 8; i++) {
      state = timerReducer(state, { type: 'START', now: NOW })
      state = timerReducer(state, { type: 'COMPLETE', now: NOW })
      modes.push(state.mode)
    }
    expect(modes).toEqual([
      'shortBreak',
      'focus',
      'shortBreak',
      'focus',
      'shortBreak',
      'focus',
      'longBreak',
      'focus',
    ])
    expect(state.completedFocusCount).toBe(4)
  })
})

describe('SKIP', () => {
  it('focus -> shortBreak (idle), counter unchanged', () => {
    const next = timerReducer(makeState(), { type: 'SKIP' })
    expect(next).toMatchObject({
      mode: 'shortBreak',
      status: 'idle',
      endsAt: null,
      remainingMs: 5 * MIN,
      completedFocusCount: 0,
    })
  })

  it('skipping focus never leads to a long break', () => {
    const next = timerReducer(running({ completedFocusCount: 3 }), { type: 'SKIP' })
    expect(next.mode).toBe('shortBreak')
    expect(next.completedFocusCount).toBe(3)
  })

  it('break -> focus (idle) with full duration', () => {
    const state = makeState({ mode: 'shortBreak', status: 'paused', remainingMs: MIN })
    const next = timerReducer(state, { type: 'SKIP' })
    expect(next).toMatchObject({ mode: 'focus', status: 'idle', remainingMs: 25 * MIN })
  })

  it('works while running and clears endsAt', () => {
    const next = timerReducer(running({ mode: 'longBreak' }), { type: 'SKIP' })
    expect(next.mode).toBe('focus')
    expect(next.status).toBe('idle')
    expect(next.endsAt).toBeNull()
  })

  it('never autostarts, even with autostart enabled', () => {
    const state = running({
      settings: { ...settings, autoStartBreaks: true, autoStartFocus: true },
    })
    expect(timerReducer(state, { type: 'SKIP' }).status).toBe('idle')
  })
})

describe('SWITCH_MODE', () => {
  it('switches to the given mode, idle, full duration', () => {
    const next = timerReducer(running(), { type: 'SWITCH_MODE', mode: 'longBreak' })
    expect(next).toMatchObject({
      mode: 'longBreak',
      status: 'idle',
      endsAt: null,
      remainingMs: 15 * MIN,
    })
  })

  it('keeps the focus counter', () => {
    const state = makeState({ completedFocusCount: 3 })
    const next = timerReducer(state, { type: 'SWITCH_MODE', mode: 'shortBreak' })
    expect(next.completedFocusCount).toBe(3)
  })

  it('switching to the same mode restarts it from full duration', () => {
    const state = makeState({ status: 'paused', remainingMs: MIN })
    const next = timerReducer(state, { type: 'SWITCH_MODE', mode: 'focus' })
    expect(next.status).toBe('idle')
    expect(next.remainingMs).toBe(25 * MIN)
  })
})

describe('APPLY_SETTINGS', () => {
  const newSettings: TimerSettings = {
    ...settings,
    focusMinutes: 50,
    shortBreakMinutes: 10,
  }

  it('idle: replaces settings and recalculates remainingMs', () => {
    const next = timerReducer(makeState(), { type: 'APPLY_SETTINGS', settings: newSettings })
    expect(next.settings).toEqual(newSettings)
    expect(next.remainingMs).toBe(50 * MIN)
  })

  it('paused: replaces settings, the current interval keeps its time', () => {
    const state = makeState({ status: 'paused', remainingMs: 3 * MIN })
    const next = timerReducer(state, { type: 'APPLY_SETTINGS', settings: newSettings })
    expect(next.settings).toEqual(newSettings)
    expect(next.status).toBe('paused')
    expect(next.remainingMs).toBe(3 * MIN)
  })

  it('running: replaces settings, endsAt unchanged', () => {
    const state = running({ endsAt: NOW + 3 * MIN })
    const next = timerReducer(state, { type: 'APPLY_SETTINGS', settings: newSettings })
    expect(next.settings).toEqual(newSettings)
    expect(next.status).toBe('running')
    expect(next.endsAt).toBe(NOW + 3 * MIN)
  })

  it('new durations apply from the next interval', () => {
    let state = running({ endsAt: NOW + 3 * MIN })
    state = timerReducer(state, { type: 'APPLY_SETTINGS', settings: newSettings })
    state = timerReducer(state, { type: 'COMPLETE', now: NOW + 3 * MIN })
    expect(state.remainingMs).toBe(10 * MIN)
  })
})
