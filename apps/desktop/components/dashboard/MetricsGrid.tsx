import MetricCard
  from "../common/MetricCard";

type Props = {
  stocksTracked: number;
  topPick: string;
  recommendations: number;
};

export default function MetricsGrid({
  stocksTracked,
  topPick,
  recommendations,
}: Props) {
  return (
    <div className="grid grid-cols-3 gap-6">
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
