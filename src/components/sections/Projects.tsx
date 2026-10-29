import type { Project, Stack } from '../../types/portfolio'
import { useProjectFilter, type StackFilter } from '../../hooks/useProjectFilter'
import { PlaceTag } from '../ui/PlaceTag'
import { TagList } from '../ui/Tag'
import { ProjectFilter } from '../ui/ProjectFilter'
import { ScreenPreview } from '../ui/ScreenPreview'
import styles from './Projects.module.css'

interface ProjectsProps {
  projects: Project[]
  stacks: Stack[]
}

const byline = (project: Project): string => [project.client, project.year].filter(Boolean).join(', ')

// Each featured project has a tower in the tech park; its dashboard plays on the rooftop billboard.
const FeaturedProject = ({ project }: { project: Project }) => (
  <article className={`panel ${styles.featured}`} data-stop={`project-${project.id}`} tabIndex={-1}>
    <PlaceTag stop={`project-${project.id}`} />
    {project.screen && (
      <ScreenPreview screen={project.screen} label={`Illustration of the ${project.title} interface`} />
    )}
    <div className={styles.featuredBody}>
      <p className={styles.byline}>{byline(project)}</p>
      <h3 className={styles.featuredTitle}>{project.title}</h3>
      <p className={styles.description}>{project.description}</p>
      <TagList items={project.tech} label="Built with" />
    </div>
  </article>
)

const ProjectRow = ({ project }: { project: Project }) => (
  <li className={styles.row}>
    <p className={styles.year}>{project.year}</p>
    <div>
      <h4 className={styles.rowTitle}>{project.title}</h4>
      {project.client && <p className={styles.client}>{project.client}</p>}
    </div>
    <p className={styles.rowDescription}>{project.description}</p>
    <TagList items={project.tech} label="Built with" />
  </li>
)

export const Projects = ({ projects, stacks }: ProjectsProps) => {
  const featured = projects.filter((project) => project.featured)
  const others = projects.filter((project) => !project.featured)
  const { active, setActive, visible } = useProjectFilter(others)
  const options: StackFilter[] = ['All', ...stacks]

  return (
    <section className={`column ${styles.section}`} aria-labelledby="projects-title">
      <header id="projects" className={`panel ${styles.header}`} data-stop="projects" tabIndex={-1}>
        <PlaceTag stop="projects" />
        <h2 id="projects-title" className={styles.title}>
          Selected projects
        </h2>
        <p className={styles.intro}>
          Work from my jobs and freelance clients. The screens are illustrations; client work stays private.
        </p>
      </header>

      {featured.map((project) => (
        <FeaturedProject key={project.id} project={project} />
      ))}

      <div className={`panel ${styles.more}`} data-stop="projects">
        <div className={styles.moreHeader}>
          <h3 className={styles.moreTitle}>More projects</h3>
          <ProjectFilter options={options} active={active} onChange={setActive} />
        </div>

        <p className={styles.count} aria-live="polite">
          Showing {visible.length} of {others.length}
        </p>

        {visible.length > 0 ? (
          <ul className={styles.list}>
            {visible.map((project) => (
              <ProjectRow key={project.id} project={project} />
            ))}
          </ul>
        ) : (
          <p className={styles.empty}>
            Nothing in {active} yet.{' '}
            <button type="button" className={styles.reset} onClick={() => setActive('All')}>
              Show all projects
            </button>
          </p>
        )}
      </div>
    </section>
  )
}
