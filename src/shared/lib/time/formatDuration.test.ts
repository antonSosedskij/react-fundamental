import { describe, expect, it } from 'vitest'
import { formatDuration } from './formatDuration'

describe('formatDuration', () => {
  it.each([
    [0, '00:00'],
    [1, '00:01'],
    [999, '00:01'],
    [1000, '00:01'],
    [61_000, '01:01'],
    [25 * 60_000, '25:00'],
    [25 * 60_000 - 400, '25:00'],
    [90 * 60_000, '90:00'],
    [-5000, '00:00'],
  ])('%i ms -> %s', (ms, expected) => {
    expect(formatDuration(ms)).toBe(expected)
  })
})
