import { YahooPriceScraper }
from '../../scrapers/us/yahoo-finance/yahoo-price.scraper';

async function run() {
  const scraper =
    new YahooPriceScraper();

  const data =
    await scraper.getHistory('AAPL');

  console.log(data.slice(0, 5));
}

run();
