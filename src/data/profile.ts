import type { NavLink, Profile } from '../types/portfolio'

export const profile: Profile = {
  name: 'Gigih Satriono',
  role: 'Software Engineer',
  tagline:
    'I build web apps for banks, telecoms, and government teams. Mostly Angular on the front, Laravel and Go behind it, and the pipelines that ship both.',
  location: 'Tangerang, Indonesia',
  summary: [
    'I spent five years on a factory floor at Gajah Tunggal, setting up and calibrating tire curing presses, while studying informatics at night. A press is unforgiving: if the mold is off, every tire that comes out is off. I still think about frontend work that way. Get the component right once and every page built from it is right too.',
    'Since 2021 I have worked as a developer. Four and a half years at MNC Kabel Mediacom covered everything from customer self-care apps to a hotel LMS, plus the Docker and CI/CD setup that let us deploy about three times as often. Now I am a Senior Software Engineer at Bank Mandiri, working on Livin’ Merchant and Livin’ Food.',
  ],
  email: 'gsatriono@gmail.com',
  linkedin: 'https://www.linkedin.com/in/gigih-satriono',
  photo: '/gigih.jpg',
}

export const navLinks: NavLink[] = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
]
