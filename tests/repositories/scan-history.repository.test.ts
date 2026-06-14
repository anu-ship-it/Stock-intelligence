import { ScanHistoryRepository }
from '../../backend/repositories/scan-history.repository';

async function run() {

  const repo =
    new ScanHistoryRepository();

  const scan =
    await repo.create({
      startedAt:
        new Date(),

      totalStocks: 3,

      successfulStocks: 0,

      failedStocks: 0,

      status: 'RUNNING'
    });

  console.dir(
    scan,
    { depth: null }
  );
}

run();
