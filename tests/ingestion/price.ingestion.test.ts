import { PriceIngestionService }
from '../../backend/services/price-ingestion.service';

async function run() {

  const service =
    new PriceIngestionService();

  const count =
    await service.ingest('AAPL');

  console.log(
    `Inserted ${count} candles`
  );
}

run();
