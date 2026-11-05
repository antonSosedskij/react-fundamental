/**
 * Milliseconds -> "MM:SS". Rounds up to whole seconds, so 24:59.4 shows as "25:00".
 * Negative values show as "00:00".
 */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${pad(minutes)}:${pad(seconds)}`
}

function pad(value: number): string {
  return String(value).padStart(2, '0')
}
