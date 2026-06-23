import { RecommendationRepository }
  from '../../repositories/recommendation.repository';

export class RecommendationsController {

  private recommendationRepository =
    new RecommendationRepository();

  async top(
    req: any,
    res: any
  ) {

    const recommendations =
  await this.recommendationRepository
    .latestPerStock();

    res.json(
      recommendations.map(item => ({
        symbol:
          item.stock.symbol,

        recommendation:
          item.recommendation,

        confidence:
          item.confidence,

        scanDate:
          item.scanDate
      }))
    );
  }
}
