import { useStocks } from "../hooks/useStocks";

import { useScan } from "../hooks/useScan";

import StockTable from "../components/StockTable";

import RecommendationCard from "../components/RecommendationTable";

import { useRecommendations } from "../hooks/useRecommendations";

import MetricsCards from "../components/MetricsCards";

export default function Dashboard() {
  const { stocks, loading, error } = useStocks();

  const { scan, loading: scanLoading } = useScan();

  const { recommendations } = useRecommendations();


  async function handleScan() {
    try {
      await scan();

      alert("Market Scan Completed");

      window.location.reload();
    } catch (error) {
      console.error(error);

      alert("Market Scan Failed");
    }
  }

  const stocksTracked = stocks.length;

  const topPick = stocks.length > 0 ? stocks[0].symbol : "N/A";

  const recommendationCount = recommendations.length;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div
      style={{
        padding: "20px",
      }}
    >
      <h1>PennyScope</h1>

      <MetricsCards
        stocksTracked={stocksTracked}
        topPick={topPick}
        recommendations={recommendationCount}
      />

      <button
        onClick={handleScan}
        disabled={scanLoading}
        style={{
          marginBottom: "20px",
          padding: "10px 16px",
          cursor: "pointer",
        }}
      >
        {scanLoading ? "Scanning..." : "Run Market Scan"}
      </button>

      <StockTable stocks={stocks} />

      <RecommendationCard recommendations={recommendations} />
    </div>
  );
}
