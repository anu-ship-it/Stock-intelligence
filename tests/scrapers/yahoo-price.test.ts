import { YahooPriceScraper } from '../../scrapers/us/yahoo-finance/yahoo-price.scraper';

async function run() {
  const scraper = new YahooPriceScraper();

  const data = await scraper.getHistory('AAPL');

  console.log('Rows:', data.length);

  console.log(data[0]);

  console.log(data[data.length - 1]);
}

run();
