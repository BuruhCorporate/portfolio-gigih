import { useEffect, useState } from 'react'
import type { NavLink } from '../../types/portfolio'
import { useActiveSection } from '../../hooks/useActiveSection'
import styles from './Navbar.module.css'

interface NavbarProps {
  links: NavLink[]
}

export const Navbar = ({ links }: NavbarProps) => {
  const [open, setOpen] = useState(false)
  const [ids] = useState(() => links.map((link) => link.id))
  const active = useActiveSection(ids)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className={styles.bar}>
      <nav className={styles.inner} aria-label="Main">
        <button
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls="nav-links"
          onClick={() => setOpen((value) => !value)}
        >
          <span className={styles.toggleIcon} data-open={open} aria-hidden="true" />
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
        </button>

        <ul id="nav-links" className={styles.links} data-open={open}>
          {links.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                className={styles.link}
                aria-current={active === link.id ? 'true' : undefined}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a href="#contact" className={styles.cta}>
          Get in touch
        </a>
      </nav>
    </header>
  )
}
