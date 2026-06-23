import {
  useEffect,
  useState
} from 'react';

import {
  getStock,
  getAnalysis
} from '../api/stock-detail.api';

export function useStockDetail(
  symbol: string
) {

  const [stock, setStock] =
    useState<any>(null);

  const [analysis, setAnalysis] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    async function load() {

      const stockData =
        await getStock(symbol);

      const analysisData =
        await getAnalysis(symbol);

      setStock(stockData);

      setAnalysis(
        analysisData
      );

      setLoading(false);
    }

    load();

  }, [symbol]);

  return {
    stock,
    analysis,
    loading
  };
}
