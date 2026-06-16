import { ScoreRepository } from '../repositories/score.repository';
import { StockRepository } from '../repositories/stock.repository';

export class ScorePersistenceService {

  private scoreRepository =
    new ScoreRepository();

  private stockRepository =
    new StockRepository();

  async save(
    symbol: string,
    score: {
      technicalScore: number;
      fundamentalScore?: number;
      sentimentScore?: number;
      riskScore?: number;
      finalScore?: number;
    }
  ) {

    const stock =
      await this.stockRepository.findBySymbol(
        symbol
      );

    if (!stock) {
      throw new Error(
        `Stock not found: ${symbol}`
      );
    }

    return this.scoreRepository.save({
      stockId: stock.id,

      scanDate: new Date(),

      technicalScore:
        score.technicalScore,

      fundamentalScore:
        score.fundamentalScore ?? 0,

      sentimentScore:
        score.sentimentScore ?? 0,

      riskScore:
        score.riskScore ?? 0,

      finalScore:
        score.finalScore ??
        score.technicalScore
    });
  }
}
