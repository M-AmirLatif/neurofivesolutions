import { Banknote, Landmark, MapPin, Users } from 'lucide-react';
import { memo } from 'react';
import { NUMBER_FORMATTER } from '../../utils/constants';
import styles from './CountryCard.module.css';

function getCurrency(currencies) {
  const values = Object.values(currencies ?? {});
  if (!values.length) return 'Not available';
  return values.map(({ name, symbol }) => symbol ? `${name} (${symbol})` : name).join(', ');
}

function CountryCard({ country }) {
  const name = country.name.common;
  const capital = country.capital?.join(', ') || 'No official capital';
  const flagUrl =
    country.flags?.svg ||
    country.flags?.png ||
    'https://flagcdn.com/' + country.cca2.toLowerCase() + '.svg';
  const population = Number.isFinite(country.population)
    ? NUMBER_FORMATTER.format(country.population)
    : 'Not available';

  return (
    <article className={styles.card}>
      <div className={styles.flagWrap}>
        <img src={flagUrl} alt={country.flags?.alt || `Flag of ${name}`} loading="lazy" decoding="async" />
        <span>{country.cca3}</span>
      </div>
      <div className={styles.body}>
        <p className={styles.region}><MapPin aria-hidden="true" />{country.region}</p>
        <h2>{name}</h2>
        <dl>
          <div><dt><Landmark aria-hidden="true" />Capital</dt><dd>{capital}</dd></div>
          <div><dt><Users aria-hidden="true" />Population</dt><dd>{population}</dd></div>
          <div><dt><Banknote aria-hidden="true" />Currency</dt><dd>{getCurrency(country.currencies)}</dd></div>
        </dl>
      </div>
    </article>
  );
}

export default memo(CountryCard);
