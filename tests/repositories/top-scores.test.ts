import { AnalysisRepository }
from '../../backend/repositories/analysis.repository';

async function run() {

  const repo =
    new AnalysisRepository();

  const result =
    await repo.topStocks(10);

  console.table(
    result.map(r => ({
      symbol:
        r.stock.symbol,

      finalScore:
        r.finalScore
    }))
  );
}

run();
