export class GrowthEngine {

  calculate(data: {
    revenue?: number;
    eps?: number;
  }) {

    let score = 0;

    if ((data.revenue ?? 0) > 0) {
      score += 50;
    }

    if ((data.eps ?? 0) > 0) {
      score += 50;
    }

    return score;
  }
}
