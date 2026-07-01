import { useStocks } from "../hooks/useStocks";

import MetricsGrid
  from "../components/dashboard/MetricsGrid";

import StockTable
  from "../components/dashboard/StockTable";

import RecommendationTable
  from "../components/dashboard/RecommendationTable";

import PageHeader
  from "../components/common/PageHeader";

import SectionCard
  from "../components/common/SectionCard";

import { useRecommendations }
  from "../hooks/useRecommendations";

import { useScan }
  from "../hooks/useScan";

export default function Dashboard() {

  const {
    stocks,
    loading,
    error
  } = useStocks();

  const {
    recommendations
  } = useRecommendations();

  const {
    loading: scanning,
    runScan
  } = useScan();

  if (loading) {
    return (
      <div className="text-slate-300">
        Loading Dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400">
        {error}
      </div>
    );
  }

  return (

    <div className="space-y-8">

      <PageHeader
        title="Dashboard"
        subtitle="Monitor your market intelligence and AI recommendations."
      />

      <MetricsGrid
        stocksTracked={stocks.length}
        topPick={stocks[0]?.symbol ?? "-"}
        recommendations={recommendations.length}
      />

      <SectionCard
        title="Top Ranked Stocks"
      >

        <StockTable
          stocks={stocks}
        />

      </SectionCard>

      <SectionCard
        title="Latest Recommendations"
      >

        <RecommendationTable
          recommendations={recommendations}
        />

      </SectionCard>

      <div>

        <button
          onClick={runScan}
          disabled={scanning}
          className="
            rounded-xl
            bg-blue-600
            px-6
            py-3
            font-semibold
            transition
            hover:bg-blue-500
            disabled:opacity-50
          "
        >

          {
            scanning
              ? "Scanning..."
              : "Run Market Scan"
          }

        </button>

      </div>

    </div>

  );

}
