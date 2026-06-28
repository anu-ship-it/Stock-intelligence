import MetricCard
  from '../common/MetricCard';

type Props = {
  stocksTracked: number;
  topPick: string;
  recommendations: number;
};

export default function MetricsGrid({
  stocksTracked,
  topPick,
  recommendations
}: Props) {

  return (

    <div
      style={{
        display: 'flex',
        gap: '20px',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}
    >

      <MetricCard
        title="Stocks Tracked"
        value={stocksTracked}
      />

      <MetricCard
        title="Top Pick"
        value={topPick}
      />

      <MetricCard
        title="Recommendations"
        value={recommendations}
      />

    </div>

  );
}
