import { useStocks }
  from '../hooks/useStocks';

import StockTable
  from '../components/StockTable';

export default function Dashboard() {

  const {
    stocks,
    loading,
    error
  } = useStocks();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (

    <div>

      <h1>
        PennyScope
      </h1>

      <StockTable
        stocks={stocks}
      />

    </div>
  );
}