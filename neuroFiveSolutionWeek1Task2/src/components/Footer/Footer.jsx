import { Globe2 } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  return <footer className={styles.footer}><div><span><Globe2 aria-hidden="true" />Country Explorer</span><p>Live data provided by REST Countries API</p></div></footer>;
}
