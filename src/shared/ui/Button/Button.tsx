import { type ComponentPropsWithoutRef } from 'react'
import styles from './Button.module.css'

export type ButtonProps = ComponentPropsWithoutRef<'button'> & { variant?: ButtonVariant }

export type ButtonVariant = 'primary' | 'secondary'

export const Button = ({
  variant = 'primary',
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) => {
  return (
    <button
      {...rest}
      type={type}
      className={[styles.button, styles[variant], className].filter(Boolean).join(' ')}
    >
      {children}
    </button>
  )
}
