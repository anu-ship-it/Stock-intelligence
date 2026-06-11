export class ValuationEngine {

  calculate(data: {
    peRatio?: number;
    pbRatio?: number;
  }) {

    let score = 0;

    if (
      data.peRatio &&
      data.peRatio < 25
    ) {
      score += 50;
    }

    if (
      data.pbRatio &&
      data.pbRatio < 10
    ) {
      score += 50;
    }

    return score;
  }
}
