import YahooFinance from 'yahoo-finance2';
import { PriceData } from '../../common/types/price-data';

const yahooFinance = new YahooFinance();

export class YahooPriceScraper {
  async getHistory(
    symbol: string
  ): Promise<PriceData[]> {

    const result = await yahooFinance.historical(
      symbol,
      {
        period1: '2024-01-01'
      }
    );

    return result.map(item => ({
      date: item.date,
      open: item.open ?? 0,
      high: item.high ?? 0,
      low: item.low ?? 0,
      close: item.close ?? 0,
      volume: item.volume ?? 0
    }));
  }
}
