import { ScanOrchestratorService }
from '../../backend/services/scan-orchestrator.service';

async function run() {

  const service =
    new ScanOrchestratorService();

  const result =
    await service.run();

  console.table(result);
}

run();
