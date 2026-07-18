import { RefreshCw, WifiOff } from 'lucide-react';
import styles from './ErrorMessage.module.css';

export default function ErrorMessage({ onRetry }) {
  return <section className={styles.error} role="alert"><span><WifiOff aria-hidden="true" /></span><h2>Unable to load countries</h2><p>Please check your internet connection and try again.</p><button type="button" onClick={onRetry}><RefreshCw aria-hidden="true" />Try again</button></section>;
}
