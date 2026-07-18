import { Globe2 } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        <a className={styles.brand} href="#top" aria-label="Country Explorer home">
          <span className={styles.logo}><Globe2 aria-hidden="true" /></span>
          <span>Country Explorer</span>
        </a>
        <span className={styles.badge}>Live world data</span>
      </div>
    </header>
  );
}
