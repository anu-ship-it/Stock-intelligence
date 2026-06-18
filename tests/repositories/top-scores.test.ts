import { AnalysisRepository }
from '../../backend/repositories/analysis.repository';

async function run() {

  const repo =
    new AnalysisRepository();

  const result =
    await repo.topStocks();

  console.table(
  result.map(r => ({
    symbol:
      r.stock.symbol,

    finalScore:
      r.score.finalScore,

    technicalScore:
      r.score.technicalScore,

    fundamentalScore:
      r.score.fundamentalScore
  }))
);
}

run();
