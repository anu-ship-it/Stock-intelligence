export class FundamentalScoreEngine {

  calculate(data: {
    valuation: number;
    profitability: number;
    growth: number;
    debt: number;
  }) {

    return (
      data.valuation +
      data.profitability +
      data.growth +
      data.debt
    ) / 4;

  }

}
