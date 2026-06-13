import { StockRepository }
  from '../repositories/stock.repository';

import { PriceIngestionService }
  from './price-ingestion.service';

import { FinancialIngestionService }
  from './financial-ingestion.service';

import { MarketScannerService }
  from './market-scanner.service';

export class ScanOrchestratorService {

  private stockRepository =
    new StockRepository();

  private priceIngestionService =
    new PriceIngestionService();

  private financialIngestionService =
    new FinancialIngestionService();

  private marketScannerService =
    new MarketScannerService();

  async run() {

    const stocks =
      await this.stockRepository.getAll();

    for (const stock of stocks) {

      try {

        await this.priceIngestionService
          .ingest(stock.symbol);

        await this.financialIngestionService
          .ingest(stock.symbol);

      } catch (error) {

        console.error(
          `Ingestion failed: ${stock.symbol}`,
          error
        );
      }
    }

    return this.marketScannerService
      .scan();
  }
}
