import { PriceRepository }
from '../../backend/repositories/price.repository';

async function run() {

  const repo =
    new PriceRepository();

  const prices =
    await repo.getHistory(
      2,
      10
    );

  console.table(
    prices.map(p => ({
      date: p.date,
      close: p.close
    }))
  );
}

run();
