import { YahooFundamentalsScraper }
from '../../scrapers/us/yahoo-finance/yahoo-fundamentals.scraper';

async function run() {

  const scraper =
    new YahooFundamentalsScraper();

  const data =
    await scraper.getFundamentals(
      'AAPL'
    );

  console.dir(
    data,
    { depth: null }
  );
}

run();
