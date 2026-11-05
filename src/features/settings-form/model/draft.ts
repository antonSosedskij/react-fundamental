import { SETTINGS_LIMITS, type Settings } from '@/entities/settings'

export type NumberField =
  'focusMinutes' | 'shortBreakMinutes' | 'longBreakMinutes' | 'longBreakInterval'
export type BooleanField = 'autoStartBreaks' | 'autoStartFocus' | 'soundEnabled'

/**
 * What the form edits. Numbers stay strings while the user types,
 * so an empty field is just "" instead of 0 or NaN.
 */
export type SettingsDraft = Record<NumberField, string> & Pick<Settings, BooleanField>

export type DraftErrors = Partial<Record<NumberField, string>>

interface NumberFieldConfig {
  name: NumberField
  label: string
  min: number
  max: number
}

const { minutes, longBreakInterval } = SETTINGS_LIMITS

export const NUMBER_FIELDS: NumberFieldConfig[] = [
  { name: 'focusMinutes', label: 'Фокус, мин', ...minutes },
  { name: 'shortBreakMinutes', label: 'Короткий перерыв, мин', ...minutes },
  { name: 'longBreakMinutes', label: 'Длинный перерыв, мин', ...minutes },
  { name: 'longBreakInterval', label: 'Фокусов до длинного перерыва', ...longBreakInterval },
]

export const BOOLEAN_FIELDS: { name: BooleanField; label: string }[] = [
  { name: 'autoStartBreaks', label: 'Автостарт перерывов' },
  { name: 'autoStartFocus', label: 'Автостарт фокуса' },
  { name: 'soundEnabled', label: 'Звук по окончании' },
]

export function toDraft(settings: Settings): SettingsDraft {
  return {
    ...settings,
    focusMinutes: String(settings.focusMinutes),
    shortBreakMinutes: String(settings.shortBreakMinutes),
    longBreakMinutes: String(settings.longBreakMinutes),
    longBreakInterval: String(settings.longBreakInterval),
  }
}

/** Empty object means the draft is valid. */
export function validateDraft(draft: SettingsDraft): DraftErrors {
  const errors: DraftErrors = {}

  for (const { name, min, max } of NUMBER_FIELDS) {
    const value = Number(draft[name])
    const isValid = draft[name].trim() !== '' && Number.isInteger(value)

    if (!isValid || value < min || value > max) {
      errors[name] = `Целое число от ${min} до ${max}`
    }
  }

  return errors
}

/** Call only for a valid draft. */
export function toSettings(draft: SettingsDraft): Settings {
  return {
    ...draft,
    focusMinutes: Number(draft.focusMinutes),
    shortBreakMinutes: Number(draft.shortBreakMinutes),
    longBreakMinutes: Number(draft.longBreakMinutes),
    longBreakInterval: Number(draft.longBreakInterval),
  }
}
