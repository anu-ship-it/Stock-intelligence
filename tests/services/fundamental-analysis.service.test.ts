import { FundamentalAnalysisService }
from '../../backend/services/fundamental-analysis.service';

async function run() {

  const service =
    new FundamentalAnalysisService();

  const symbols = [
    'AAPL',
    'MSFT',
    'TCS'
  ];

  for (const symbol of symbols) {

    const result =
      await service.analyze(
        symbol
      );

    console.dir(
      result,
      { depth: null }
    );

    console.log(
      '----------------'
    );
  }
}

run();