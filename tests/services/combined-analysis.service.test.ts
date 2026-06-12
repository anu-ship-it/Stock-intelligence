import { CombinedAnalysisService }
from '../../backend/services/combined-analysis.service';

async function run() {

  const service =
    new CombinedAnalysisService();

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
