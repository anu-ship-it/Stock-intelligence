import { TechnicalAnalysisService }
from '../../backend/services/technical-analysis.service';

async function run() {

  const service =
    new TechnicalAnalysisService();

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
