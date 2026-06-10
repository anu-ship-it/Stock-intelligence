import { StockRepository }
  from '../repositories/stock.repository';

import { TechnicalAnalysisService }
  from './technical-analysis.service';

import { ScorePersistenceService }
  from './score-persistence.service';

export class MarketScannerService {

  private stockRepository =
    new StockRepository();

  private technicalAnalysisService =
    new TechnicalAnalysisService();

  private scorePersistenceService =
    new ScorePersistenceService();

  async scan() {

    const stocks =
      await this.stockRepository.getAll();

    const results = [];

    for (const stock of stocks) {

      try {

        const analysis =
          await this.technicalAnalysisService
            .analyze(stock.symbol);

        await this.scorePersistenceService
          .save(stock.symbol, {
            technicalScore:
              analysis.score
          });
        results.push({
          symbol: stock.symbol,
          score: analysis.score,
          currentPrice:
            analysis.currentPrice,
          rsi:
            analysis.rsi,
          ema20:
            analysis.ema20,
          ema50:
            analysis.ema50,
          macd:
            analysis.macd,
          signal:
            analysis.signal,
          histogram:
            analysis.histogram
        });

      } catch (error) {

        console.error(
          `Failed: ${stock.symbol}`,
          error
        );

      }
    }

    return results.sort(
      (a, b) =>
        b.score - a.score
    );
  }
}
