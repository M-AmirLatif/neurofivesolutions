import { Search, SlidersHorizontal, X } from 'lucide-react';
import { REGIONS } from '../../utils/constants';
import styles from './SearchBar.module.css';

export default function SearchBar({ search, onSearchChange, region, onRegionChange }) {
  return (
    <div className={styles.controls} aria-label="Country filters">
      <div className={styles.searchWrap}>
        <Search aria-hidden="true" />
        <label className="srOnly" htmlFor="country-search">Search by country name</label>
        <input id="country-search" type="search" value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search for a country..." autoComplete="off" />
        {search && <button className={styles.clear} type="button" onClick={() => onSearchChange('')} aria-label="Clear search"><X /></button>}
      </div>
      <div className={styles.selectWrap}>
        <SlidersHorizontal aria-hidden="true" />
        <label className="srOnly" htmlFor="region-filter">Filter by region</label>
        <select id="region-filter" value={region} onChange={(event) => onRegionChange(event.target.value)}>
          {REGIONS.map((item) => <option key={item} value={item}>{item === 'All' ? 'All regions' : item}</option>)}
        </select>
      </div>
    </div>
  );
}
