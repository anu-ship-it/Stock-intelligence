export class DebtEngine {

  calculate(data: {
    debt?: number;
    cash?: number;
  }) {

    const debt =
      data.debt ?? 0;

    const cash =
      data.cash ?? 0;

    if (cash >= debt) {
      return 100;
    }

    if (cash >= debt * 0.5) {
      return 50;
    }

    return 0;
  }
}
