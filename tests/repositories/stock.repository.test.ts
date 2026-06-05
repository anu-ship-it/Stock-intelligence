import { StockRepository } from '../../backend/repositories/stock.repository';

async function run() {
  const repo = new StockRepository();

  const stock = await repo.create({
    symbol: 'TCS',
    companyName: 'Tata Consultancy Services',
    marketId: 1
  });

  console.log(stock);
}

run();