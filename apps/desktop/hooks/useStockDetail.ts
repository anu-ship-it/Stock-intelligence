import {
  useEffect,
  useState
} from 'react';

import {
  getOverview
} from '../api/stock-detail.api';

export function useStockDetail(
  symbol: string
) {

  const [data, setData] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    async function load() {

      const result =
        await getOverview(
          symbol
        );

      setData(result);

      setLoading(false);
    }

    load();

  }, [symbol]);

  return {
    data,
    loading
  };
}
