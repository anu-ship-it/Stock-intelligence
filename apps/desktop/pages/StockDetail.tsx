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
    data,
    loading
  } =
    useStockDetail(
      symbol!
    );

  if (loading) {
    return <div>Loading...</div>;
  }

  const financial =
    data.financials?.[0];

  const score =
    data.scores?.[0];

  const recommendation =
    data.recommendations?.[0];

  return (

    <div
      style={{
        padding: '20px'
      }}
    >

      <h1>
        {data.companyName}
      </h1>

      <h2>
        {data.symbol}
      </h2>

      <p>
        Yahoo Symbol:
        {' '}
        {data.yahooSymbol}
      </p>

      <hr />

      <h2>
        Recommendation
      </h2>

      <p>
        {recommendation?.recommendation}
      </p>

      <p>
        Confidence:
        {' '}
        {recommendation?.confidence}%
      </p>

      <hr />

      <h2>
        Analysis
      </h2>

      <p>
        Technical Score:
        {' '}
        {score?.technicalScore}
      </p>

      <p>
        Fundamental Score:
        {' '}
        {score?.fundamentalScore}
      </p>

      <p>
        Final Score:
        {' '}
        {score?.finalScore}
      </p>

      <hr />

      <h2>
        Financial Metrics
      </h2>

      <p>
        PE Ratio:
        {' '}
        {financial?.peRatio}
      </p>

      <p>
        PB Ratio:
        {' '}
        {financial?.pbRatio}
      </p>

      <p>
        ROE:
        {' '}
        {financial?.roe}
      </p>

      <p>
        EPS:
        {' '}
        {financial?.eps}
      </p>

      <p>
        Revenue Growth:
        {' '}
        {financial?.revenueGrowth}
      </p>

    </div>
  );
}
