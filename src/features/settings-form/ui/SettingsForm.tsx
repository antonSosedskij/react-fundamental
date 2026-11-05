import { useSettings, type Settings } from '@/entities/settings'
import { Button } from '@/shared/ui'
import { useState, type ChangeEvent, type SubmitEvent } from 'react'
import {
  BOOLEAN_FIELDS,
  NUMBER_FIELDS,
  toDraft,
  toSettings,
  validateDraft,
  type BooleanField,
  type NumberField,
} from '../model/draft'
import styles from './SettingsForm.module.css'

export interface SettingsFormProps {
  onSave: (next: Settings) => void
}

export function SettingsForm({ onSave }: SettingsFormProps) {
  const { settings } = useSettings()
  const [draft, setDraft] = useState(() => toDraft(settings))

  // Derived on every render, not stored: errors always match the draft.
  const errors = validateDraft(draft)
  const hasErrors = Object.keys(errors).length > 0

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (hasErrors) return

    onSave(toSettings(draft))
  }

  // One handler per input type: the field is taken from the input's `name`.
  const handleNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name as NumberField
    setDraft({ ...draft, [name]: event.target.value })
  }

  const handleBooleanChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name as BooleanField
    setDraft({ ...draft, [name]: event.target.checked })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.numbers}>
        {NUMBER_FIELDS.map(({ name, label, min, max }) => {
          const error = errors[name]
          const errorId = `${name}-error`

          return (
            <label key={name} className={styles.field}>
              <span className={styles.label}>{label}</span>
              <input
                className={styles.input}
                type="number"
                inputMode="numeric"
                name={name}
                min={min}
                max={max}
                value={draft[name]}
                onChange={handleNumberChange}
                aria-invalid={error !== undefined}
                aria-describedby={error ? errorId : undefined}
              />
              {error && (
                <span id={errorId} className={styles.error}>
                  {error}
                </span>
              )}
            </label>
          )
        })}
      </div>

      <div className={styles.toggles}>
        {BOOLEAN_FIELDS.map(({ name, label }) => (
          <label key={name} className={styles.toggle}>
            <input
              className={styles.checkbox}
              type="checkbox"
              name={name}
              checked={draft[name]}
              onChange={handleBooleanChange}
            />
            {label}
          </label>
        ))}
      </div>

      <Button type="submit" className={styles.submit} disabled={hasErrors}>
        Сохранить
      </Button>
    </form>
  )
}
