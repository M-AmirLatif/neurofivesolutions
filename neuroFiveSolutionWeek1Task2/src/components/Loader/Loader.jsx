import styles from './Loader.module.css';

export default function Loader() {
  return <div className={styles.loader} role="status"><span aria-hidden="true" /><p>Mapping the world...</p><small>Fetching the latest country data</small></div>;
}
