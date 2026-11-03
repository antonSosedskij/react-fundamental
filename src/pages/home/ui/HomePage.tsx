import { StatsPanel } from '@/widgets/stats-panel'
import { TimerPanel } from '@/widgets/timer-panel'
import styles from './HomePage.module.css'

export function HomePage() {
  return (
    <main className={styles.page}>
      <TimerPanel />
      <StatsPanel />
    </main>
  )
}
