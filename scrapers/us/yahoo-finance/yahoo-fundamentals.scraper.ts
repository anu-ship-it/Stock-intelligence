import YahooFinance from 'yahoo-finance2';

const yahooFinance =
  new YahooFinance();

export class YahooFundamentalsScraper {

  async getFundamentals(
    symbol: string
  ) {

    const result =
      await yahooFinance.quoteSummary(
        symbol,
        {
          modules: [
            'defaultKeyStatistics',
            'financialData',
            'summaryDetail'
          ]
        }
      );

    return {
      marketCap:
        result.summaryDetail
          ?.marketCap,

      peRatio:
        result.summaryDetail
          ?.trailingPE,

      pbRatio:
        result.defaultKeyStatistics
          ?.priceToBook,

      roe:
        result.financialData
          ?.returnOnEquity
    };
  }
}