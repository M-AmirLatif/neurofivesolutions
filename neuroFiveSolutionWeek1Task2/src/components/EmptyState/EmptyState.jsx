import { SearchX } from 'lucide-react';
import styles from './EmptyState.module.css';

export default function EmptyState({ onClear }) {
  return <section className={styles.empty}><span><SearchX aria-hidden="true" /></span><h2>No countries found</h2><p>Try another search or choose a different region.</p><button type="button" onClick={onClear}>Clear filters</button></section>;
}
