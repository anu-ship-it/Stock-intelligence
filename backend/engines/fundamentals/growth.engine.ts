export class GrowthEngine {

  calculate(data: {
    eps?: number;
  }) {

    const eps =
      data.eps ?? 0;

    if (eps > 20) {
      return 100;
    }

    if (eps > 5) {
      return 50;
    }

    return 0;
  }
}
