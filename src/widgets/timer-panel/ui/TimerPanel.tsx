import { TimerDisplay, type Mode } from '@/entities/timer'
import { ModeSwitcher } from '@/features/mode-switcher'
import { TimerControls } from '@/features/timer-controls'
import styles from './TimerPanel.module.css'
import { useState } from 'react'

const noop = () => {
  console.log('onChange')
}

export function TimerPanel() {
  const [mode, setMode] = useState<Mode>('focus')

  const onModeChange = (mode: Mode) => {
    setMode(mode)
  }

  return (
    <section className={styles.panel} aria-label="Таймер">
      <ModeSwitcher mode={mode} onChange={onModeChange} />

      <TimerDisplay time="25:00" mode={mode} pomodoroNumber={1} progress={0.35} />

      <TimerControls status="idle" onStart={noop} onPause={noop} onReset={noop} onSkip={noop} />
    </section>
  )
}
