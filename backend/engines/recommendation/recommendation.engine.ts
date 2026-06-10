export class RecommendationEngine {

  getRecommendation(
    score: number
  ) {

    if (score >= 80) {
      return {
        recommendation: 'STRONG_BUY',
        confidence: 90
      };
    }

    if (score >= 60) {
      return {
        recommendation: 'BUY',
        confidence: 75
      };
    }

    if (score >= 40) {
      return {
        recommendation: 'WATCH',
        confidence: 60
      };
    }

    if (score >= 20) {
      return {
        recommendation: 'WEAK',
        confidence: 40
      };
    }

    return {
      recommendation: 'AVOID',
      confidence: 20
    };
  }
}
