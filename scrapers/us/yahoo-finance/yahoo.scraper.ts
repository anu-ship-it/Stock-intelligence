import { Scraper } from '../../common/scraper.interface';
import { YahooStock } from './yahoo.types';

export class YahooScraper
  implements Scraper<YahooStock>
{
  async scrape(): Promise<YahooStock[]> {
    return [
      {
        symbol: 'AAPL',
        companyName: 'Apple Inc.',
        marketCap: 3000000000000
      },
      {
        symbol: 'MSFT',
        companyName: 'Microsoft Corp.',
        marketCap: 3200000000000
      }
    ];
  }
}
