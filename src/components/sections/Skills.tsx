import type { SkillGroup } from '@/types/portfolio'
import { Section } from '@/components/layout/Section'
import { TagList } from '@/components/ui/Tag'
import styles from './Skills.module.css'

interface SkillsProps {
  groups: SkillGroup[]
}

export const Skills = ({ groups }: SkillsProps) => (
  <Section id="skills" stop="skills" title="Tools I use">
    <div className={styles.grid}>
      {groups.map((group) => (
        <div key={group.label} className={styles.group}>
          <h3 className={styles.label}>{group.label}</h3>
          <TagList items={group.items} />
        </div>
      ))}
    </div>
  </Section>
)
