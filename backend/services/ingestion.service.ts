import { StockRepository } from '../repositories/stock.repository';
import { YahooScraper } from '../../scrapers/us/yahoo-finance/yahoo.scraper';

export class IngestionService {
  private stockRepository =
    new StockRepository();

  private yahooScraper =
    new YahooScraper();

  async ingestYahooStocks() {
    const stocks =
      await this.yahooScraper.scrape();

    for (const stock of stocks) {
      const existing =
        await this.stockRepository.findBySymbol(
          stock.symbol
        );

      if (!existing) {
        await this.stockRepository.create({
          symbol: stock.symbol,
          companyName: stock.companyName,
          marketCap: stock.marketCap,
          marketId: 2
        });
      }
    }

    return stocks.length;
  }
}
