import styles from './StatCard.module.css'

interface StatCardProps {
  value: number
  label: string
}

export function StatCard({ value, label }: StatCardProps) {
  return (
    <div className={styles.card}>
      <span className={styles.value}>{value}</span>
      <span className={styles.label}>{label}</span>
    </div>
  )
}
