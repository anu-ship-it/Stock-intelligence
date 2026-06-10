import { PriceRepository }
from '../../backend/repositories/price.repository';

async function run() {

  const repo =
    new PriceRepository();

  const data =
    await repo.getHistory(
      2,
      5
    );

  console.log(data);
}

run();
