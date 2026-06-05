import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

export class YahooPriceScraper {
  async getHistory(symbol: string) {
    return yahooFinance.chart(symbol, {
      period1: '2024-01-01',
      interval: '1d'
    });
  }
}
