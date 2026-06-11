export class ProfitabilityEngine {

  calculate(data: {
    roe?: number;
  }) {

    if (!data.roe) {
      return 0;
    }

    if (data.roe > 0.20) {
      return 100;
    }

    if (data.roe > 0.10) {
      return 50;
    }

    return 0;
  }
}
