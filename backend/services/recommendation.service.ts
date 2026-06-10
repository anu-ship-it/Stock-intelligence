import { RecommendationEngine }
  from '../engines/recommendation/recommendation.engine';

import { RecommendationRepository }
  from '../repositories/recommendation.repository';

export class RecommendationService {

  private recommendationEngine =
    new RecommendationEngine();

  private recommendationRepository =
    new RecommendationRepository();

  async create(
    stockId: number,
    score: number
  ) {

    const result =
      this.recommendationEngine
        .getRecommendation(score);

    return this.recommendationRepository
      .create({
        stockId,
        recommendation:
          result.recommendation,
        confidence:
          result.confidence
      });
  }
}