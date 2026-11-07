import {
  createInitialTimerState,
  getModeDurationMs,
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
import { useEffect, useReducer, useRef } from 'react'
import { useSettings, type Settings } from '@/entities/settings'
import { formatDuration, useDocumentTitle, useNow } from '@/shared/lib'
import { completeSoundUrl } from '@/shared/assets'
import { SettingsForm } from '@/features/settings-form'
import { useSessions } from '@/entities/session'
import { useTimerHotkeys } from '@/features/hotkeys'

/** Module-level, so it is not a new function every render and not an effect dependency. */
function playSound(audio: HTMLAudioElement | null) {
  if (!audio) return

  audio.currentTime = 0
  // The browser may refuse playback (autoplay policy); the timer must keep working anyway.
  audio.play().catch(() => {})
}

export function TimerPanel() {
  const { settings, updateSettings } = useSettings()
  const { addSession } = useSessions()

  const [state, dispatch] = useReducer(timerReducer, settings, createInitialTimerState)
  const now = useNow(state.status === 'running')
  const audioRef = useRef<HTMLAudioElement>(null)

  const remainingMs = getRemainingMs(state, now)
  const time = formatDuration(remainingMs)
  const progress = getProgress(state, now)
  const pomodoroNumber = getPomodoroNumber(state)

  const { endsAt, status, mode } = state
  const isFinished = status === 'running' && remainingMs === 0

  useDocumentTitle(`${time} · ${MODE_LABELS[mode]}`)

  // Time ran out: signal it and let the reducer move to the next mode.
  // Re-runs only when isFinished flips, not on every tick.
  useEffect(() => {
    if (!isFinished || endsAt === null) return

    if (settings.soundEnabled) {
      playSound(audioRef.current)
    }

    // Recorded here, next to COMPLETE, from the state before the transition.
    // Skipped intervals never reach this code, so they are never recorded.
    if (mode === 'focus') {
      addSession({ endedAt: endsAt, durationMs: getModeDurationMs(mode, state.settings) })
    }

    // endsAt, not Date.now(): the tick notices zero late, and a sleeping tab even later.
    dispatch({ type: 'COMPLETE', now: endsAt })
  }, [isFinished, endsAt, mode, state.settings, settings.soundEnabled, addSession])

  const onSettingsSave = (settings: Settings) => {
    updateSettings(settings)
    dispatch({
      type: 'APPLY_SETTINGS',
      settings,
    })
  }

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

  const onToggle = () => {
    if (status === 'running') handlePause()
    else handleStart()
  }

  useTimerHotkeys({ onToggle, onReset: handleReset, onSkip: handleSkip })

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

      <details className={styles.settings}>
        <summary className={styles.settingsSummary}>Настройки</summary>
        <SettingsForm key={JSON.stringify(settings)} onSave={onSettingsSave} />
      </details>

      <audio ref={audioRef} src={completeSoundUrl} />
    </section>
  )
}
