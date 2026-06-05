import { IngestionService }
from '../../backend/services/ingestion.service';

async function run() {
  const service =
    new IngestionService();

  const count =
    await service.ingestYahooStocks();

  console.log(
    `Imported ${count} stocks`
  );
}

run();
