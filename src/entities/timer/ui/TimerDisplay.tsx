import { MODE_LABELS } from '../model/constants'
import type { Mode } from '../model/types'
import styles from './TimerDisplay.module.css'

export interface TimerDisplayProps {
  /** Already formatted, e.g. "25:00". */
  time: string
  mode: Mode
  pomodoroNumber: number
  /** From 0 to 1. */
  progress: number
}

export function TimerDisplay({ time, mode, pomodoroNumber, progress }: TimerDisplayProps) {
  const percent = Math.round(progress * 100)

  return (
    <div className={styles.display} data-mode={mode}>
      <div className={styles.meta}>
        <span className={styles.mode}>{MODE_LABELS[mode]}</span>
        <span className={styles.number}>#{pomodoroNumber}</span>
      </div>

      <div role="timer" className={styles.time}>
        {time}
      </div>

      <div
        className={styles.track}
        role="progressbar"
        aria-label="Прогресс интервала"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
      >
        <div className={styles.fill} style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}
