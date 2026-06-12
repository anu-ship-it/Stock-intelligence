import { FundamentalAnalysisService }
from '../../backend/services/fundamental-analysis.service';

async function run() {

  const service =
    new FundamentalAnalysisService();

  const result =
    await service.analyze(
      'AAPL'
    );

  console.dir(
    result,
    { depth: null }
  );
}

run();
