import type { Mode } from './types'

export const MODE_LABELS: Record<Mode, string> = {
  focus: 'Фокус',
  shortBreak: 'Короткий перерыв',
  longBreak: 'Длинный перерыв',
}

export const MODES: readonly Mode[] = ['focus', 'shortBreak', 'longBreak']
