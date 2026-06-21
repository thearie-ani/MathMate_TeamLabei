import { useState, useEffect } from 'react';

/**
 * A generic hook for fetching data from an API.
 * @param {Function} apiFunction - The API function to call (e.g., from an api/*.js file).
 * @param {Array} dependencies - An array of dependencies that trigger a re-fetch when changed.
 * @returns {Object} { data, isLoading, error, refetch }
 */
export function useFetch(apiFunction, dependencies = []) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await apiFunction();
      setData(result);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { data, isLoading, error, refetch: fetchData };
}
