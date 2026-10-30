import type { Certification, Education } from '@/types/portfolio'

export const education: Education = {
  degree: 'Bachelor of Informatics Engineering',
  school: 'Universitas Muhammadiyah Tangerang',
  period: '2017 – 2021',
  note: 'GPA 3.63 / 4.00. Studied while working full time at Gajah Tunggal.',
}

export const certifications: Certification[] = [
  {
    title: 'DevOps Engineer Bootcamp, Batch 10',
    issuer: 'Digital Skola',
    date: 'Feb 2026',
    detail: 'Three-month intensive. Graduated with an Excellent grade. Credential 024/BC/GRD/DOE10/II/2026.',
  },
  {
    title: 'ASEAN Ahead Programme',
    issuer: 'ASEAN Foundation',
    date: '2026',
    detail: 'AI career readiness, cybersecurity (including Microsoft’s Guide to a Secure Digital World), and digital literacy.',
  },
]
