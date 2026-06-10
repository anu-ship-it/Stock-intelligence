import { MarketScannerService }
from '../../backend/services/market-scanner.service';

async function run() {

  const scanner =
    new MarketScannerService();

  const results =
    await scanner.scan();

  console.table(results);
}

run();
