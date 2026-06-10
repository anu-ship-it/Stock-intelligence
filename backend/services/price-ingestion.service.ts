import { StockRepository } from '../repositories/stock.repository';
import { PriceRepository } from '../repositories/price.repository';

import { YahooPriceScraper } from '../../scrapers/us/yahoo-finance/yahoo-price.scraper';

export class PriceIngestionService {
  private stockRepository =
    new StockRepository();

  private priceRepository =
    new PriceRepository();

  private yahooPriceScraper =
    new YahooPriceScraper();

  async ingest(symbol: string) {

    const stock =
      await this.stockRepository.findBySymbol(
        symbol
      );

    if (!stock) {
      throw new Error(
        `Stock not found: ${symbol}`
      );
    }

    const history =
      await this.yahooPriceScraper.getHistory(
        symbol
      );

    for (const candle of history) {
       if (
    candle.close <= 0 ||
    candle.open <= 0 ||
    candle.high <= 0 ||
    candle.low <= 0
  ) {
    continue;
  }

  await this.priceRepository.upsertPrice({
    stockId: stock.id,
    date: candle.date,
    open: candle.open,
    high: candle.high,
    low: candle.low,
    close: candle.close,
    volume: candle.volume
  });
}

    return history.length;
  }
}
