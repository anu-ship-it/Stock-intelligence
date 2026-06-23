import {
  useParams
} from 'react-router-dom';

import {
  useStockDetail
} from '../hooks/useStockDetail';

export default function StockDetail() {

  const { symbol } =
    useParams();

  const {
    stock,
    analysis,
    loading
  } =
    useStockDetail(
      symbol!
    );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (

    <div
      style={{
        padding: '20px'
      }}
    >

      <h1>
        {stock.companyName}
      </h1>

      <h2>
        {stock.symbol}
      </h2>

      <hr />

      <h3>
        Analysis
      </h3>

      <p>
        Technical Score:
        {' '}
        {analysis.technicalScore}
      </p>

      <p>
        Fundamental Score:
        {' '}
        {analysis.fundamentalScore}
      </p>

      <p>
        Final Score:
        {' '}
        {analysis.finalScore}
      </p>

    </div>
  );
}