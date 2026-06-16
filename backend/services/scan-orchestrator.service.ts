import { StockRepository }
  from '../repositories/stock.repository';

import { PriceIngestionService }
  from './price-ingestion.service';

import { FinancialIngestionService }
  from './financial-ingestion.service';

import { MarketScannerService }
  from './market-scanner.service';

import { ScanHistoryRepository }
  from '../repositories/scan-history.repository';
  

export class ScanOrchestratorService {

  private stockRepository =
    new StockRepository();

  private priceIngestionService =
    new PriceIngestionService();

  private financialIngestionService =
    new FinancialIngestionService();

  private marketScannerService =
    new MarketScannerService();

  private scanHistoryRepository =
  new ScanHistoryRepository();  

  async run() {

  const stocks =
    await this.stockRepository.getAll();

  const scan =
    await this.scanHistoryRepository
      .create({
        startedAt:
          new Date(),

        totalStocks:
          stocks.length,

        successfulStocks: 0,

        failedStocks: 0,

        status: 'RUNNING'
      });

  let successfulStocks = 0;
  let failedStocks = 0;

  for (const stock of stocks) {

    try {

      await this.priceIngestionService
        .ingest(stock.symbol);

      await this.financialIngestionService
        .ingest(stock.symbol);

      successfulStocks++;

    } catch (error) {

      failedStocks++;

      console.error(
        `Ingestion failed: ${stock.symbol}`,
        error
      );
    }
  }

  const results =
    await this.marketScannerService
      .scan();

  await this.scanHistoryRepository
    .complete(
      scan.id,
      {
        completedAt:
          new Date(),

        successfulStocks,

        failedStocks,

        status: 'COMPLETED'
      }
    );

  return results;
  }}
