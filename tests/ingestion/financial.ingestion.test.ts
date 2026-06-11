import { FinancialIngestionService }
from '../../backend/services/financial-ingestion.service';

async function run() {

  const service =
    new FinancialIngestionService();

  const symbols = [
    'AAPL',
    'MSFT'
  ];

  for (const symbol of symbols) {

    const result =
      await service.ingest(symbol);

    console.log(
      `${symbol}: saved`
    );

    console.dir(
      result,
      { depth: null }
    );
  }
}

run();
