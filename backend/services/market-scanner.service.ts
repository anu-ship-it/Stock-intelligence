import { StockRepository }
  from '../repositories/stock.repository';

import { CombinedAnalysisService }
  from './combined-analysis.service';

import { ScorePersistenceService }
  from './score-persistence.service';
import { RecommendationService }
  from './recommendation.service';

export class MarketScannerService {

  private stockRepository =
    new StockRepository();

  private combinedAnalysisService =
    new CombinedAnalysisService();

  private scorePersistenceService =
    new ScorePersistenceService();

  private recommendationService =
    new RecommendationService();

  async scan() {

    const stocks =
      await this.stockRepository.getAll();

    const results = [];

    for (const stock of stocks) {

      try {

        const analysis =
          await this.combinedAnalysisService
            .analyze(stock.symbol);

        await this.scorePersistenceService
          .save(stock.symbol, {

            technicalScore:
              analysis.technicalScore,

            fundamentalScore:
              analysis.fundamentalScore,

            finalScore:
              analysis.finalScore

          });

        await this.recommendationService
          .create(
            stock.id,
            analysis.finalScore
          );

        results.push({
          symbol: stock.symbol,

          technicalScore:
            analysis.technicalScore,

          fundamentalScore:
            analysis.fundamentalScore,

          finalScore:
            analysis.finalScore
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
