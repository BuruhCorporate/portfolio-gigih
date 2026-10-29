import type { StackFilter } from '../../hooks/useProjectFilter'
import styles from './ProjectFilter.module.css'

interface ProjectFilterProps {
  options: StackFilter[]
  active: StackFilter
  onChange: (value: StackFilter) => void
}

export const ProjectFilter = ({ options, active, onChange }: ProjectFilterProps) => (
  <div className={styles.filter} role="group" aria-label="Filter projects by stack">
    {options.map((option) => (
      <button
        key={option}
        type="button"
        className={styles.option}
        aria-pressed={option === active}
        onClick={() => onChange(option)}
      >
        {option}
      </button>
    ))}
  </div>
)
