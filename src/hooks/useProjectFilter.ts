import { useMemo, useState } from 'react'
import type { Project, Stack } from '../types/portfolio'

export type StackFilter = Stack | 'All'

export const useProjectFilter = (projects: Project[]) => {
  const [active, setActive] = useState<StackFilter>('All')

  const visible = useMemo(
    () => (active === 'All' ? projects : projects.filter((project) => project.stacks.includes(active))),
    [projects, active],
  )

  return { active, setActive, visible }
}
