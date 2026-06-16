export class DebtEngine {

  calculate(data: {
    debt?: number;
    cash?: number;
    currentRatio?: number;
  }) {

    const debt =
      data.debt ?? 0;

    const cash =
      data.cash ?? 0;

    const currentRatio =
      data.currentRatio ?? 0;

    if (
      cash >= debt &&
      currentRatio >= 2
    ) {
      return 100;
    }

    if (
      cash >= debt * 0.5 &&
      currentRatio >= 1
    ) {
      return 50;
    }

    return 0;
  }
}