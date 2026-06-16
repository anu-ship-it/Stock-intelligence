import { ScanHistoryRepository }
from '../../backend/repositories/scan-history.repository';

async function run() {

  const repo =
    new ScanHistoryRepository();

  const result =
    await repo.latest();

  console.table(result);
}

run();
