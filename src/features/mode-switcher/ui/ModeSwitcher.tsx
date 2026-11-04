import { MODE_LABELS, MODES, type Mode } from '@/entities/timer'
import styles from './ModeSwitcher.module.css'

export interface ModeSwitcherProps {
  mode: Mode
  onChange: (mode: Mode) => void
}

export function ModeSwitcher({ mode, onChange }: ModeSwitcherProps) {
  return (
    <div className={styles.switcher} role="group" aria-label="Режим таймера">
      {MODES.map((m) => (
        <button
          type="button"
          onClick={() => onChange(m)}
          className={styles.tab}
          aria-pressed={m === mode}
          key={m}
        >
          {MODE_LABELS[m]}
        </button>
      ))}
    </div>
  )
}
