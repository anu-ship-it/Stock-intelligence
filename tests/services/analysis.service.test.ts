import { AnalysisService }
  from '../../backend/services/analysis.service';

async function run() {

  const service =
    new AnalysisService();

  const stocks =
    await service.getTopStocks();

  console.table(
    stocks.map(s => ({
      symbol:
        s.stock.symbol,

      score:
        s.score.finalScore
    }))
  );
}

run();
