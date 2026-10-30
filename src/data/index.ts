import type { Stat } from '@/types/portfolio'
import { experience } from './experience'
import { projects } from './projects'

export { certifications, education } from './credentials'
export { experience } from './experience'
export { cityPoster } from './media'
export { navLinks, profile } from './profile'
export { projects, stacks } from './projects'
export { skillGroups } from './skills'

// The first developer job; the factory years before it are not counted as building web apps.
const FIRST_DEV_YEAR = 2021
// The factory role is not a software team.
const NON_SOFTWARE_ROLES = 1

export const currentRole = experience.find((job) => job.end === null) ?? experience[0]

export const stats: Stat[] = [
  { value: `${new Date().getFullYear() - FIRST_DEV_YEAR}+`, label: 'years building web apps' },
  { value: String(projects.length), label: 'projects shipped' },
  { value: String(experience.length - NON_SOFTWARE_ROLES), label: 'teams worked with' },
]

// Stops on the hero's map key, in tour order.
export const mapStops = ['about', 'job-mandiri', 'job-mnc', 'job-gajah-tunggal', 'projects', 'skills', 'education', 'contact']
