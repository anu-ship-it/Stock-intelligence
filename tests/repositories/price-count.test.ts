import { PriceRepository }
from '../../backend/repositories/price.repository';

async function run() {

  const repo =
    new PriceRepository();

  const msft =
    await repo.getHistory(
      3,
      1000
    );

  console.log(
    'MSFT:',
    msft.length
  );

  const tcs =
    await repo.getHistory(
      1,
      1000
    );

  console.log(
    'TCS:',
    tcs.length
  );
}

run();
