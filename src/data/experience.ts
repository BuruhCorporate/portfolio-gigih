import type { Experience } from '../types/portfolio'

// Newest first. MNC overlaps the BPH Migas contract and the Intishaka freelance job; both ran alongside it.
export const experience: Experience[] = [
  {
    id: 'mandiri',
    role: 'Senior Software Engineer',
    company: 'PT Bank Mandiri (Persero) Tbk.',
    companyShort: 'Bank Mandiri',
    employment: 'Full-time',
    start: '2026-08',
    end: null,
    highlights: [
      'Frontend features for Mandiri’s digital products used by customers, merchants, and internal teams, in Scrum sprints with product, backend, and QA.',
      'Livin’ Food, including the monitoring and operations dashboard for food-service activity.',
      'Livin’ Merchant Web modules (LM Portal, LM Merchant Online, LM QR Table): merchant onboarding, store management, and QR transactions, built from shared Angular components.',
    ],
  },
  {
    id: 'unictive',
    role: 'Frontend Engineer',
    company: 'PT Unictive Media Indonesia',
    companyShort: 'Unictive',
    employment: 'Full-time',
    start: '2026-06',
    end: '2026-08',
    highlights: [
      'Built CMS iapays, the vendor payment system for InJourney Airports, and the Familia SSO platform in Angular.',
      'Wrote shared component libraries and an API service layer reused across projects, and reviewed pull requests.',
      'Swapped NgRx for a small Signal-based store on zoneless Angular and moved routes to lazy-loaded standalone components. Less boilerplate, faster first load.',
    ],
  },
  {
    id: 'intishaka',
    role: 'Full Stack Developer',
    company: 'PT Intishaka Global Solusindo',
    companyShort: 'Intishaka',
    employment: 'Freelance',
    start: '2025-12',
    end: '2026-04',
    highlights: [
      'Built a financial journal and reporting system in Laravel: journal entry, journal list, financial reports, and project costs.',
      'Added Excel and PDF export so finance staff download finished reports instead of assembling them by hand.',
      'Wrote the REST API for the frontend team and fixed the slow queries behind the heaviest pages.',
    ],
  },
  {
    id: 'bph-migas',
    role: 'Full Stack Developer',
    company: 'Downstream Oil and Gas Regulatory Agency (BPH Migas)',
    companyShort: 'BPH Migas',
    employment: 'Contract',
    start: '2022-07',
    end: '2023-02',
    highlights: [
      'Maintained SILVIA 2, mainly the natural gas module that regulated companies use to file reports.',
      'Configured user access and tariff rules for natural gas accounts.',
      'Built new modules in Laravel, jQuery, and Bootstrap and fixed issues reported by users.',
    ],
  },
  {
    id: 'mnc',
    role: 'Full Stack Developer',
    company: 'PT MNC Kabel Mediacom (MNC Play / Vision+)',
    companyShort: 'MNC Kabel Mediacom',
    employment: 'Full-time',
    start: '2021-12',
    end: '2026-06',
    highlights: [
      'Built and maintained Selfcare, the SingleApps CRM, an LMS for hotel partners, and MNC Group’s internal calendar.',
      'Angular, Vue.js, and Next.js on the frontend; Laravel, Yii2, and REST APIs on the backend.',
      'Containerized the apps with Docker and set up CI/CD in Jenkins, GitLab CI, and GitHub Actions. Deploys went up about 3x. Also ran Nginx and Prometheus/Grafana monitoring.',
    ],
  },
  {
    id: 'gajah-tunggal',
    role: 'Product Engineering Operator',
    company: 'PT Gajah Tunggal Tbk.',
    companyShort: 'Gajah Tunggal',
    employment: 'Full-time',
    start: '2016-08',
    end: '2021-05',
    highlights: [
      'Set up, calibrated, and maintained tire curing presses to spec, following K3 safety procedures.',
    ],
  },
]
