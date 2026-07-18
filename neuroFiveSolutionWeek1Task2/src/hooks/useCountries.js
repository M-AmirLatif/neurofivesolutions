import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { getCountries } from '../services/countryService';

export function useCountries() {
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestKey, setRequestKey] = useState(0);

  const retry = useCallback(() => setRequestKey((key) => key + 1), []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCountries() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getCountries({ signal: controller.signal });
        setCountries(data);
      } catch (requestError) {
        if (!axios.isCancel(requestError)) {
          setError(requestError);
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    loadCountries();
    return () => controller.abort();
  }, [requestKey]);

  return { countries, isLoading, error, retry };
}
