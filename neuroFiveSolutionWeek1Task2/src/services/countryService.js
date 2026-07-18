import axios from 'axios';
import fallbackCountries from 'world-countries';
import { API_URLS } from '../utils/constants';

const api = axios.create({ timeout: 5000 });

function prepareCountries(countries) {
  return countries
    .filter((country) => country.cca3 !== 'ISR')
    .sort((a, b) => a.name.common.localeCompare(b.name.common));
}

export async function getCountries({ signal } = {}) {
  let lastError;

  for (const url of API_URLS) {
    try {
      const { data } = await api.get(url, { signal });
      if (!Array.isArray(data)) {
        throw new Error('The countries service returned an unexpected response.');
      }
      return prepareCountries(data);
    } catch (error) {
      if (axios.isCancel(error)) throw error;
      lastError = error;
    }
  }

  if (fallbackCountries.length) {
    return prepareCountries(fallbackCountries);
  }

  throw lastError ?? new Error('No country data source is available.');
}
