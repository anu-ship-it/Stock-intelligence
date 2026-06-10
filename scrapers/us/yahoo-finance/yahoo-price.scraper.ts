import YahooFinance from 'yahoo-finance2';
import { PriceData } from '../../common/types/price-data';

const yahooFinance = new YahooFinance();

export class YahooPriceScraper {
  async getHistory(
    symbol: string
  ): Promise<PriceData[]> {

    const result = await yahooFinance.chart(symbol, {
      period1: new Date('2024-01-01'),
      period2: new Date(),
      interval: '1d'
    });

    const quotes = result.quotes ?? [];

    return quotes
  .filter(q =>
    q.open != null &&
    q.high != null &&
    q.low != null &&
    q.close != null &&
    q.close > 0
  )
  .map(q => ({
    date: q.date,
    open: q.open!,
    high: q.high!,
    low: q.low!,
    close: q.close!,
    volume: q.volume ?? 0
  }));
  }
}
