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

    return quotes.map(q => ({
      date: q.date,
      open: q.open ?? 0,
      high: q.high ?? 0,
      low: q.low ?? 0,
      close: q.close ?? 0,
      volume: q.volume ?? 0
    }));
  }
}
