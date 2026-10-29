import styles from './Footer.module.css'

export const Footer = ({ name }: { name: string }) => (
  <footer className={`column panel ${styles.footer}`}>
    <p>
      &copy; {new Date().getFullYear()} {name}
    </p>
  </footer>
)
