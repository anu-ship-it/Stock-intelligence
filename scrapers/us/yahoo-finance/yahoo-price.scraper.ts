import yahooFinance from 'yahoo-finance2';

export class YahooPriceScraper {
  async getHistory(symbol: string) {
    const result =
      await yahooFinance.historical(symbol, {
        period1: '2024-01-01',
        interval: '1d'
      });

    return result;
  }
}
