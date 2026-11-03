import type { DayStats, TodayStats } from '@/entities/session'
import { StatCard } from './StatCard'
import { WeekChart } from './WeekChart'
import styles from './StatsPanel.module.css'

// Stage 1 mocks. In stage 7 these come from useSessions() + getTodayStats / getLastDaysStats / getStreak.
const MOCK_TODAY: TodayStats = { count: 3, focusMinutes: 75 }
const MOCK_STREAK = 4
const MOCK_DAYS: DayStats[] = [
  { date: '2026-10-28', count: 2, focusMinutes: 50 },
  { date: '2026-10-29', count: 0, focusMinutes: 0 },
  { date: '2026-10-30', count: 5, focusMinutes: 125 },
  { date: '2026-10-31', count: 4, focusMinutes: 100 },
  { date: '2026-11-01', count: 6, focusMinutes: 150 },
  { date: '2026-11-02', count: 1, focusMinutes: 25 },
  { date: '2026-11-03', count: 3, focusMinutes: 75 },
]

export function StatsPanel() {
  return (
    <section className={styles.panel} aria-labelledby="stats-title">
      <h2 id="stats-title" className={styles.title}>
        Статистика
      </h2>

      <div className={styles.cards}>
        <StatCard value={MOCK_TODAY.count} label="Помодоро сегодня" />
        <StatCard value={MOCK_TODAY.focusMinutes} label="Минут сегодня" />
        <StatCard value={MOCK_STREAK} label="Дней подряд" />
      </div>

      <WeekChart days={MOCK_DAYS} />
    </section>
  )
}
