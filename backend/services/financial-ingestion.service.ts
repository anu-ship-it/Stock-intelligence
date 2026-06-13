import { StockRepository }
  from '../repositories/stock.repository';

import { FinancialRepository }
  from '../repositories/financial.repository';

import { YahooFundamentalsScraper }
  from '../../scrapers/us/yahoo-finance/yahoo-fundamentals.scraper';

export class FinancialIngestionService {

  private stockRepository =
    new StockRepository();

  private financialRepository =
    new FinancialRepository();

  private fundamentalsScraper =
    new YahooFundamentalsScraper();

  async ingest(
    symbol: string
  ) {

    const stock =
      await this.stockRepository
        .findBySymbol(symbol);

    if (!stock) {
      throw new Error(
        `Stock not found: ${symbol}`
      );
    }

    const yahooSymbol =
      stock.yahooSymbol ??
      stock.symbol;

    const data =
      await this.fundamentalsScraper
        .getFundamentals(
          yahooSymbol
        );
        
    return this.financialRepository
      .save({
        stockId:
          stock.id,

        reportDate:
          new Date(),

        peRatio:
          data.peRatio,

        pbRatio:
          data.pbRatio,

        roe:
          data.roe,
         
        revenue:  
          data.revenue,

        debt:  
          data.debt,

        cash:
          data.cash,

        eps:  
          data.eps,
      });
  }
}
