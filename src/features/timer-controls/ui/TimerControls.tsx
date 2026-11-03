import type { Status } from '@/entities/timer'
import { Button } from '@/shared/ui'
import styles from './TimerControls.module.css'

export interface TimerControlsProps {
  status: Status
  onStart: () => void
  onPause: () => void
  onReset: () => void
  onSkip: () => void
}

const START_LABELS: Record<Exclude<Status, 'running'>, string> = {
  idle: 'Старт',
  paused: 'Продолжить',
}

export function TimerControls({ status, onStart, onPause, onReset, onSkip }: TimerControlsProps) {
  const isRunning = status === 'running'

  return (
    <div className={styles.controls}>
      <Button variant="secondary" onClick={onReset} disabled={status === 'idle'}>
        Сброс
      </Button>

      {isRunning ? (
        <Button className={styles.main} onClick={onPause}>
          Пауза
        </Button>
      ) : (
        <Button className={styles.main} onClick={onStart}>
          {START_LABELS[status]}
        </Button>
      )}

      <Button variant="secondary" onClick={onSkip}>
        Пропустить
      </Button>
    </div>
  )
}
