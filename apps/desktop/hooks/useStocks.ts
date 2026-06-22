import {
  useEffect,
  useState
} from 'react';

import {
  getTopStocks
} from '../api/stocks.api';

export function useStocks() {

  const [stocks, setStocks] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  useEffect(() => {

  console.log('useStocks started');

  async function load() {

    console.log('load() called');

    try {

      console.log('before API');

      const data =
        await getTopStocks();

      console.log(
        'after API',
        data
      );

      setStocks(data);

    } catch (err) {

      console.error(
        'FETCH ERROR',
        err
      );

      setError(
        String(err)
      );

    } finally {

      console.log(
        'loading finished'
      );

      setLoading(false);
    }
  }

  load();

}, []);

  return {
    stocks,
    loading,
    error
  };
}