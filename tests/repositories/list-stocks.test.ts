import { StockRepository }
from '../../backend/repositories/stock.repository';

async function run() {

  const repo =
    new StockRepository();

  const stocks =
    await repo.getAll();

  console.table(
    stocks.map(s => ({
      id: s.id,
      symbol: s.symbol
    }))
  );
}

run();
