import CountryCard from '../CountryCard/CountryCard';
import styles from './CountryGrid.module.css';

export default function CountryGrid({ countries }) {
  return <div className={styles.grid}>{countries.map((country) => <CountryCard key={country.cca3} country={country} />)}</div>;
}
