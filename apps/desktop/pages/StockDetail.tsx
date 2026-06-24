import {
  useParams
} from 'react-router-dom';

import {
  useStockDetail
} from '../hooks/useStockDetail';

import MetricCard
  from '../components/MetricCard';

import RecommendationCard
  from '../components/RecommendationTable';

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
        padding: '24px'
      }}
    >

      <h1>
        {data.companyName}
      </h1>

      <p>
        {data.yahooSymbol}
      </p>

      <RecommendationCard
        recommendation={
          recommendation?.recommendation
        }
        confidence={
          recommendation?.confidence
        }
      />

      <div
        style={{
          display: 'flex',
          gap: '16px',
          marginTop: '20px',
          flexWrap: 'wrap'
        }}
      >

        <MetricCard
          title="Technical Score"
          value={
            score?.technicalScore
          }
        />

        <MetricCard
          title="Fundamental Score"
          value={
            score?.fundamentalScore
          }
        />

        <MetricCard
          title="Final Score"
          value={
            score?.finalScore
          }
        />

      </div>

      <h2
        style={{
          marginTop: '30px'
        }}
      >
        Financial Metrics
      </h2>

      <div
        style={{
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap'
        }}
      >

        <MetricCard
          title="PE Ratio"
          value={
            financial?.peRatio ??
            'N/A'
          }
        />

        <MetricCard
          title="PB Ratio"
          value={
            financial?.pbRatio ??
            'N/A'
          }
        />

        <MetricCard
          title="ROE"
          value={
            financial?.roe ??
            'N/A'
          }
        />

        <MetricCard
          title="EPS"
          value={
            financial?.eps ??
            'N/A'
          }
        />

      </div>

    </div>
  );
}