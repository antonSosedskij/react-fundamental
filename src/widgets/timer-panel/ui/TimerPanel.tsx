import {
  createInitialTimerState,
  getPomodoroNumber,
  getProgress,
  getRemainingMs,
  MODE_LABELS,
  TimerDisplay,
  timerReducer,
  type Mode,
} from '@/entities/timer'
import { ModeSwitcher } from '@/features/mode-switcher'
import { TimerControls } from '@/features/timer-controls'
import styles from './TimerPanel.module.css'
import { useEffect, useReducer } from 'react'
import { DEFAULT_SETTINGS } from '@/entities/settings'
import { formatDuration, useDocumentTitle, useNow } from '@/shared/lib'

export function TimerPanel() {
  const [state, dispatch] = useReducer(timerReducer, DEFAULT_SETTINGS, createInitialTimerState)
  const now = useNow(state.status === 'running')

  const remainingMs = getRemainingMs(state, now)
  const time = formatDuration(remainingMs)
  const progress = getProgress(state, now)
  const pomodoroNumber = getPomodoroNumber(state)

  const { endsAt, status, mode } = state

  useDocumentTitle(`${time} · ${MODE_LABELS[mode]}`)

  useEffect(() => {
    if (status === 'running' && !remainingMs && endsAt !== null) {
      dispatch({
        type: 'COMPLETE',
        now: endsAt,
      })
    }
  }, [status, endsAt, remainingMs])

  const handleStart = () => {
    dispatch({
      type: 'START',
      now: Date.now(),
    })
  }

  const handlePause = () => {
    dispatch({
      type: 'PAUSE',
      now: Date.now(),
    })
  }

  const handleReset = () => {
    dispatch({
      type: 'RESET',
    })
  }

  const handleSkip = () => {
    dispatch({
      type: 'SKIP',
    })
  }

  const onModeChange = (mode: Mode) => {
    dispatch({
      type: 'SWITCH_MODE',
      mode,
    })
  }

  return (
    <section className={styles.panel} aria-label="Таймер">
      <ModeSwitcher mode={state.mode} onChange={onModeChange} />

      <TimerDisplay
        time={time}
        mode={state.mode}
        pomodoroNumber={pomodoroNumber}
        progress={progress}
      />

      <TimerControls
        status={state.status}
        onStart={handleStart}
        onPause={handlePause}
        onReset={handleReset}
        onSkip={handleSkip}
      />
    </section>
  )
}
