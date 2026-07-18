import { useMemo, useState } from 'react';
import CountryGrid from './components/CountryGrid/CountryGrid';
import EmptyState from './components/EmptyState/EmptyState';
import ErrorMessage from './components/ErrorMessage/ErrorMessage';
import Footer from './components/Footer/Footer';
import Loader from './components/Loader/Loader';
import Navbar from './components/Navbar/Navbar';
import SearchBar from './components/SearchBar/SearchBar';
import { useCountries } from './hooks/useCountries';
import styles from './App.module.css';

export default function App() {
  const { countries, isLoading, error, retry } = useCountries();
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('All');

  const filteredCountries = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return countries.filter((country) => {
      const matchesName = country.name.common.toLocaleLowerCase().includes(query);
      const matchesRegion = region === 'All' || country.region === region;
      return matchesName && matchesRegion;
    });
  }, [countries, search, region]);

  const clearFilters = () => { setSearch(''); setRegion('All'); };

  return (
    <div id="top" className={styles.app}>
      <Navbar />
      <main>
        <section className={styles.hero} aria-labelledby="page-title">
          <div className={styles.heroGlow} aria-hidden="true" />
          <div className={styles.eyebrow}><span />Explore our world</div>
          <h1 id="page-title">Every country,<br /><em>one place.</em></h1>
          <p>Search nations across every continent and discover essential facts powered by live global data.</p>
          {!isLoading && !error && <div className={styles.stats}><strong>{countries.length}</strong><span>countries ready to explore</span></div>}
        </section>
        <section className={styles.content} aria-label="Countries">
          {!error && <SearchBar search={search} onSearchChange={setSearch} region={region} onRegionChange={setRegion} />}
          {!isLoading && !error && <div className={styles.results} aria-live="polite"><p>Showing <strong>{filteredCountries.length}</strong> {filteredCountries.length === 1 ? 'country' : 'countries'}</p>{region !== 'All' && <span>{region}</span>}</div>}
          {isLoading ? <Loader /> : error ? <ErrorMessage onRetry={retry} /> : filteredCountries.length ? <CountryGrid countries={filteredCountries} /> : <EmptyState onClear={clearFilters} />}
        </section>
      </main>
      <Footer />
    </div>
  );
}
