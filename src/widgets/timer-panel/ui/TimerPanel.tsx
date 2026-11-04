import { createInitialTimerState, TimerDisplay, timerReducer, type Mode } from '@/entities/timer'
import { ModeSwitcher } from '@/features/mode-switcher'
import { TimerControls } from '@/features/timer-controls'
import styles from './TimerPanel.module.css'
import { useReducer } from 'react'
import { DEFAULT_SETTINGS } from '@/entities/settings'

export function TimerPanel() {
  const [state, dispatch] = useReducer(timerReducer, DEFAULT_SETTINGS, createInitialTimerState)

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

      <TimerDisplay time="25:00" mode={state.mode} pomodoroNumber={1} progress={0.35} />

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
