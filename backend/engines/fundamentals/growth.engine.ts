export class GrowthEngine {

  calculate(data: {
    revenueGrowth?: number;
    earningGrowth?: number;
  }) {

    const revenueGrowth =
      data.revenueGrowth ?? 0;

    const earningGrowth =
      data.earningGrowth ?? 0;

    const avgGrowth =
      (
        revenueGrowth +
        earningGrowth
      ) / 2;

    if (avgGrowth >= 0.20) {
      return 100;
    }

    if (avgGrowth >= 0.10) {
      return 50;
    }

    return 0;
  }
}