import { TechnicalAnalysisService }
from '../../backend/services/technical-analysis.service';

async function run() {

  const service =
    new TechnicalAnalysisService();

  const rsi =
    await service.calculateRSI(
      'AAPL'
    );

  console.log(
    'AAPL RSI:',
    rsi
  );
}

run();
