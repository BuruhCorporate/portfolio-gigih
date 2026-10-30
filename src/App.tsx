import { useActiveStop } from '@/hooks/useActiveStop'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useSmoothScroll } from '@/hooks/useSmoothScroll'
import { scrollToStop } from '@/lib/scroll'
import { CityStage } from '@/features/city'
import {
  certifications,
  cityPoster,
  currentRole,
  education,
  experience,
  mapStops,
  navLinks,
  profile,
  projects,
  skillGroups,
  stacks,
  stats,
} from '@/data'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { About } from '@/components/sections/About'
import { Contact } from '@/components/sections/Contact'
import { Credentials } from '@/components/sections/Credentials'
import { ExperienceTimeline } from '@/components/sections/ExperienceTimeline'
import { Hero } from '@/components/sections/Hero'
import { Projects } from '@/components/sections/Projects'
import { Skills } from '@/components/sections/Skills'

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
      <Hero profile={profile} current={currentRole} mapStops={mapStops} onSelect={scrollToStop} />
      <About profile={profile} current={currentRole} education={education} stats={stats} />
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
