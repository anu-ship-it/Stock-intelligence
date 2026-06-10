import { PriceIngestionService }
from '../../backend/services/price-ingestion.service';

async function run() {

  const service =
    new PriceIngestionService();

  const symbols = [
    'AAPL',
    'MSFT',
    'TCS'
  ];

  for (const symbol of symbols) {

    try {

      const count =
        await service.ingest(symbol);

      console.log(
        `${symbol}: ${count} candles`
      );

    } catch (error) {

      console.error(
        `${symbol}: FAILED`,
        error
      );

    }
  }
}

run();
