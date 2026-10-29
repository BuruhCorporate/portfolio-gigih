import styles from './Tag.module.css'

interface TagListProps {
  items: string[]
  label?: string
}

export const TagList = ({ items, label }: TagListProps) => (
  <ul className={styles.list} aria-label={label}>
    {items.map((item) => (
      <li key={item} className={styles.tag}>
        {item}
      </li>
    ))}
  </ul>
)
