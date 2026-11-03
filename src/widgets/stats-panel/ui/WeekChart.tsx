import type { DayStats } from '@/entities/session'
import styles from './WeekChart.module.css'

interface WeekChartProps {
  /** Oldest first; the last item is today. */
  days: DayStats[]
}

/** "2026-11-03" -> "вт". Parsed as local midnight, not UTC. */
function weekdayLabel(date: string): string {
  return new Date(`${date}T00:00`).toLocaleDateString('ru-RU', { weekday: 'short' })
}

export function WeekChart({ days }: WeekChartProps) {
  const maxCount = Math.max(1, ...days.map((day) => day.count))
  const todayIndex = days.length - 1

  return (
    <ol className={styles.chart} aria-label="Помодоро за 7 дней">
      {days.map((day, index) => (
        <li
          key={day.date}
          className={styles.day}
          data-today={index === todayIndex || undefined}
          aria-label={`${weekdayLabel(day.date)}: ${day.count} помодоро, ${day.focusMinutes} мин`}
        >
          <span className={styles.count}>{day.count}</span>
          <div className={styles.barTrack}>
            <div className={styles.bar} style={{ height: `${(day.count / maxCount) * 100}%` }} />
          </div>
          <span className={styles.weekday}>{weekdayLabel(day.date)}</span>
        </li>
      ))}
    </ol>
  )
}
