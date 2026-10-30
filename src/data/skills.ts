import type { SkillGroup } from '@/types/portfolio'

export const skillGroups: SkillGroup[] = [
  {
    label: 'Frontend',
    items: ['Angular 16–22', 'Signals', 'RxJS', 'Vue.js', 'React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'PrimeNG', 'Bootstrap'],
  },
  {
    label: 'Backend',
    items: ['Laravel', 'Yii2', 'Node.js (Express)', 'Golang', 'REST API', 'GraphQL'],
  },
  {
    label: 'Data',
    items: ['MySQL', 'MongoDB', 'ERD design', 'Query tuning'],
  },
  {
    label: 'Testing',
    items: ['Jasmine', 'Karma', 'Jest', 'Vitest', 'Cypress', 'Playwright', 'PHPUnit'],
  },
  {
    label: 'DevOps',
    items: ['Docker', 'Kubernetes', 'Jenkins', 'GitLab CI', 'GitHub Actions', 'Nginx', 'Prometheus', 'Grafana', 'AWS', 'GCP', 'Linux', 'Bash'],
  },
  {
    label: 'Ways of working',
    items: ['Git', 'Code review', 'Scrum', 'Indonesian (native)', 'English (professional)'],
  },
]
