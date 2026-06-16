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
  analysis: {
    technicalScore: number;
    fundamentalScore: number;
    finalScore: number;
  }
) {

    const result =
  this.recommendationEngine
    .getRecommendation(
      analysis
    );

    return this.recommendationRepository
      .create({
        stockId,

        scanDate:
          new Date(),

        recommendation:
          result.recommendation,

        confidence:
          result.confidence
      });
  }
}
