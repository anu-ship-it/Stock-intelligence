import { StockRepository }
from '../../backend/repositories/stock.repository';

async function run() {

  const repo =
    new StockRepository();

  await repo.create({
    symbol: 'YESBANK',
    yahooSymbol: 'YESBANK.NS',
    companyName: 'Yes Bank',
    marketId: 1
  });

  await repo.create({
    symbol: 'SUZLON',
    yahooSymbol: 'SUZLON.NS',
    companyName: 'SUZLON',
    marketId: 2
  });

  await repo.create({
    symbol: 'TCS',
    yahooSymbol: 'TCS.NS',
    companyName: 'TCS',
    marketId: 3
  });

  await repo.create({
    symbol: 'MSFT',
    yahooSymbol: 'null',
    companyName: 'MSFT',
    marketId: 4
  });


  await repo.create({
    symbol: 'AAPL',
    yahooSymbol: 'null',
    companyName: 'AAPL',
    marketId: 5
  });

  console.log('done');
}

run();