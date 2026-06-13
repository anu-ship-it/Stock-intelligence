import YahooFinance from 'yahoo-finance2';

const yahooFinance =
  new YahooFinance();

async function run() {

  const result =
    await yahooFinance.quoteSummary(
      'AAPL',
      {
        modules: [
          'defaultKeyStatistics',
          'financialData',
          'summaryDetail'
        ]
      }
    );

  console.dir(
    result,
    { depth: null }
  );
}

run();
