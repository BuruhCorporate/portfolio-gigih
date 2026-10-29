import { navLinks, profile } from './data/profile'
import { cityPoster } from './data/media'
import { useReducedMotion } from './hooks/useReducedMotion'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { useActiveStop } from './hooks/useActiveStop'
import { scrollToStop } from './lib/scroll'
import { CityStage } from './scene/CityStage'
import { experience } from './data/experience'
import { projects, stacks } from './data/projects'
import { skillGroups } from './data/skills'
import { certifications, education } from './data/credentials'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { Hero } from './components/sections/Hero'
import { About } from './components/sections/About'
import { ExperienceTimeline } from './components/sections/ExperienceTimeline'
import { Projects } from './components/sections/Projects'
import { Skills } from './components/sections/Skills'
import { Credentials } from './components/sections/Credentials'
import { Contact } from './components/sections/Contact'

// The ongoing role, or the latest one if every role has ended.
const current = experience.find((job) => job.end === null) ?? experience[0]

const FIRST_DEV_YEAR = 2021
const stats = [
  { value: `${new Date().getFullYear() - FIRST_DEV_YEAR}+`, label: 'years building web apps' },
  { value: String(projects.length), label: 'projects shipped' },
  { value: String(experience.length - 1), label: 'teams worked with' },
]

// Places on the hero's map key, in tour order.
const mapStops = ['about', 'job-mandiri', 'job-mnc', 'job-gajah-tunggal', 'projects', 'skills', 'education', 'contact']

export const App = () => {
  useSmoothScroll(!useReducedMotion())
  const stopId = useActiveStop('overview')

  return (
  <>
    <a href="#main" className="skip-link">
      Skip to content
    </a>
    <Navbar links={navLinks} />
    <CityStage stopId={stopId} onSelect={scrollToStop} poster={cityPoster} />
    <main id="main">
      <Hero profile={profile} current={current} mapStops={mapStops} onSelect={scrollToStop} />
      <About profile={profile} current={current} education={education} stats={stats} />
      <ExperienceTimeline items={experience} />
      <Projects projects={projects} stacks={stacks} />
      <Skills groups={skillGroups} />
      <Credentials education={education} certifications={certifications} />
      <Contact profile={profile} />
    </main>
    <Footer name={profile.name} />
  </>
  )
}
