import { YahooPriceScraper } from '../../scrapers/us/yahoo-finance/yahoo-price.scraper';

async function run() {
  const scraper = new YahooPriceScraper();

  const data = await scraper.getHistory('AAPL');

  console.dir(data, { depth: 4 });
}

run();
