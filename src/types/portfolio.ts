import type { ScreenId } from '@/features/city'

export interface Profile {
  name: string
  role: string
  tagline: string
  location: string
  summary: string[]
  email: string
  linkedin: string
  photo: string
}

export interface NavLink {
  id: string
  label: string
}

export type Employment = 'Full-time' | 'Contract' | 'Freelance'

export interface Experience {
  id: string
  role: string
  company: string
  /** short form for tight spots, e.g. the hero status line */
  companyShort: string
  employment: Employment
  /** 'YYYY-MM' */
  start: string
  /** 'YYYY-MM', or null while still in the role */
  end: string | null
  highlights: string[]
}

export type Stack = 'Angular' | 'Vue' | 'Laravel' | 'Golang'

export interface Project {
  id: string
  title: string
  client?: string
  year: string
  tech: string[]
  stacks: Stack[]
  description: string
  featured?: boolean
  /** dashboard mock drawn on the project card and the laptop screen */
  screen?: ScreenId
}

export interface SkillGroup {
  label: string
  items: string[]
}

export interface Education {
  degree: string
  school: string
  period: string
  note: string
}

export interface Certification {
  title: string
  issuer: string
  date: string
  detail: string
}

export type Stat = {
  value: string
  label: string
}
