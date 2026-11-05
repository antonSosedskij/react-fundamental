import { getLastDaysStats, getStreak, getTodayStats, useSessions } from '@/entities/session'
import { StatCard } from './StatCard'
import { WeekChart } from './WeekChart'
import styles from './StatsPanel.module.css'
import { useNow } from '@/shared/lib'

export function StatsPanel() {
  // Once a minute is enough: stats only need to notice midnight.
  const now = useNow(true, 60_000)
  const { sessions } = useSessions()

  const { count, focusMinutes } = getTodayStats(sessions, now)
  const days = getLastDaysStats(sessions, now)
  const streak = getStreak(sessions, now)

  return (
    <section className={styles.panel} aria-labelledby="stats-title">
      <h2 id="stats-title" className={styles.title}>
        Статистика
      </h2>

      <div className={styles.cards}>
        <StatCard value={count} label="Помодоро сегодня" />
        <StatCard value={focusMinutes} label="Минут сегодня" />
        <StatCard value={streak} label="Дней подряд" />
      </div>

      <WeekChart days={days} />
    </section>
  )
}
