import {
  useEffect,
  useState
} from 'react';

export function useStocks() {

  const [stocks, setStocks] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    fetch(
      'http://localhost:3000/api/stocks/top'
    )
      .then(
        response => response.json()
      )
      .then(data => {

        setStocks(data);

        setLoading(false);
      });

  }, []);

  return {
    stocks,
    loading
  };
}
