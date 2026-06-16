export class RecommendationEngine {

  getRecommendation(data: {
    technicalScore: number;
    fundamentalScore: number;
    finalScore: number;
  }) {

    const {
      technicalScore,
      fundamentalScore,
      finalScore
    } = data;

    if (
      finalScore >= 80 &&
      technicalScore >= 60 &&
      fundamentalScore >= 60
    ) {
      return {
        recommendation: 'STRONG_BUY',
        confidence: 90
      };
    }

    if (
      finalScore >= 60
    ) {
      return {
        recommendation: 'BUY',
        confidence: 75
      };
    }

    if (
      fundamentalScore >= 80 &&
      technicalScore < 40
    ) {
      return {
        recommendation: 'WATCH',
        confidence: 70
      };
    }

    if (
      technicalScore >= 70 &&
      fundamentalScore < 40
    ) {
      return {
        recommendation: 'SPECULATIVE',
        confidence: 55
      };
    }

    return {
      recommendation: 'AVOID',
      confidence: 30
    };
  }
}