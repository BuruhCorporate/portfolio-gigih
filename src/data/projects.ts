import type { Project, Stack } from '../types/portfolio'

export const stacks: Stack[] = ['Angular', 'Vue', 'Laravel', 'Golang']

// Bank Mandiri work is described at feature level only: no screenshots, no integration details.
export const projects: Project[] = [
  {
    id: 'livin-merchant-reports',
    title: 'Livin’ Merchant Reports',
    client: 'Bank Mandiri',
    year: '2026',
    tech: ['Angular', 'TypeScript', 'REST API'],
    stacks: ['Angular'],
    screen: 'reports',
    description:
      'The reports section of Livin’ Merchant Web, where merchants check their transactions and sales. Built from the same Angular components the other merchant portals use, so a fix in one place lands everywhere.',
    featured: true,
  },
  {
    id: 'cms-iapays',
    title: 'CMS iapays',
    client: 'InJourney Airports',
    year: '2026',
    tech: ['Angular 22 (zoneless)', 'Tailwind CSS v4', 'PrimeNG 21'],
    stacks: ['Angular'],
    screen: 'approvals',
    description:
      'Vendor registration and payment approval for airport vendors. Vendors and internal staff get separate layouts. One verification component handles all three approval stages, and sign-in goes through Familia SSO with JWT.',
    featured: true,
  },
  {
    id: 'payment-hub',
    title: 'Payment Hub Back Office',
    client: 'Bank Mandiri',
    year: '2026',
    tech: ['Angular', 'TypeScript', 'REST API'],
    stacks: ['Angular'],
    description:
      'Internal back office where operations staff screen customer data before payments go through.',
  },
  {
    id: 'familia-sso',
    title: 'Familia SSO',
    client: 'Unictive',
    year: '2026',
    tech: ['Angular 21', 'Tailwind CSS v4', 'PrimeNG'],
    stacks: ['Angular'],
    screen: 'access',
    description:
      'One login for a group of internal apps, with screens to manage the app list, users, groups, positions, and banners.',
    featured: true,
  },
  {
    id: 'hotel-management',
    title: 'Hotel Management System',
    year: '2026',
    tech: ['Vue.js', 'Tailwind CSS', 'Docker', 'Jenkins'],
    stacks: ['Vue'],
    description:
      'Room availability, bookings, check-in and check-out, and guest records. Runs in Docker and deploys through Jenkins.',
  },
  {
    id: 'intishaka-finance',
    title: 'Financial Journal & Reporting',
    client: 'PT Intishaka Global Solusindo',
    year: '2026',
    tech: ['Laravel', 'REST API', 'Jenkins'],
    stacks: ['Laravel'],
    description:
      'Accounting app with journals, financial reports, and project costs. Reports export to Excel and PDF.',
  },
  {
    id: 'nextgo',
    title: 'NextGo Entertainment',
    client: 'KAI Access',
    year: '2025',
    tech: ['Angular 19', 'Bootstrap 5.3', 'Golang'],
    stacks: ['Angular', 'Golang'],
    description:
      'Lets train passengers stream films on board without downloading them first. Tuned for patchy mobile signal.',
  },
  {
    id: 'silvia-2',
    title: 'SILVIA 2',
    client: 'BPH Migas',
    year: '2022',
    tech: ['Laravel 5', 'Bootstrap', 'jQuery', 'Ajax'],
    stacks: ['Laravel'],
    description:
      'Reporting and administration for companies regulated by BPH Migas, with report verification and document handling.',
  },
  {
    id: 'digital-archive',
    title: 'Digital Archive',
    client: 'Thesis project',
    year: '2021',
    tech: ['Laravel 8', 'jQuery', 'Ajax', 'Bootstrap'],
    stacks: ['Laravel'],
    description:
      'Archive app for Islamic boarding schools that files documents by archive number.',
  },
]
