import { StockRepository }
  from '../repositories/stock.repository';

import { FinancialRepository }
  from '../repositories/financial.repository';

import { ValuationEngine }
  from '../engines/fundamentals/valuation.engine';

import { ProfitabilityEngine }
  from '../engines/fundamentals/profitability.engine';

import { GrowthEngine }
  from '../engines/fundamentals/growth.engine';

import { DebtEngine }
  from '../engines/fundamentals/debt.engine';

import { FundamentalScoreEngine }
  from '../engines/fundamentals/fundamental-score.engine';

export class FundamentalAnalysisService {

  private stockRepository =
    new StockRepository();

  private financialRepository =
    new FinancialRepository();

  private valuationEngine =
    new ValuationEngine();

  private profitabilityEngine =
    new ProfitabilityEngine();

  private growthEngine =
    new GrowthEngine();

  private debtEngine =
    new DebtEngine();

  private fundamentalScoreEngine =
    new FundamentalScoreEngine();

  async analyze(
    symbol: string
  ) {

    const stock =
      await this.stockRepository
        .findBySymbol(symbol);

    if (!stock) {
      throw new Error(
        `Stock not found: ${symbol}`
      );
    }

    const financials =
      await this.financialRepository
        .latest(stock.id);

    if (!financials) {
      throw new Error(
        `No financials found for ${symbol}`
      );
    }

    const valuation =
      this.valuationEngine.calculate({
        peRatio:
          financials.peRatio ?? undefined,

        pbRatio:
          financials.pbRatio ?? undefined
      });

    const profitability =
      this.profitabilityEngine.calculate({
        roe:
          financials.roe ?? undefined
      });

    const growth =
      this.growthEngine.calculate({
        eps:
          financials.eps ?? undefined
      });

    const debt =
      this.debtEngine.calculate({
        debt:
          financials.debt ?? undefined,

        cash:
          financials.cash ?? undefined
      });

    const score =
      this.fundamentalScoreEngine
        .calculate({
          valuation,
          profitability,
          growth,
          debt
        });

    return {
      symbol,

      valuation,

      profitability,

      growth,

      debt,

      score
    };
  }
}
