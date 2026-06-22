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

  console.log(
    'useStocks running'
  );

  async function load() {

    console.log(
      'load started'
    );

    try {

      const data =
        await getTopStocks();

      console.log(
        'data received',
        data
      );

      setStocks(data);

    } catch (err) {

      console.error(
        'hook error',
        err
      );

      setError(
        String(err)
      );

    } finally {

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