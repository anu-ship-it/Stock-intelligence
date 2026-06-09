import { PriceRepository } from '../repositories/price.repository';
import { StockRepository } from '../repositories/stock.repository';

import { RSIEngine } from '../technical/rsi.engine';

export class TechnicalAnalysisService {

  private priceRepository =
    new PriceRepository();

  private stockRepository =
    new StockRepository();

  private rsiEngine =
    new RSIEngine();

  async calculateRSI(symbol: string) {

    const stock =
      await this.stockRepository.findBySymbol(
        symbol
      );

    if (!stock) {
      throw new Error(
        `Stock not found: ${symbol}`
      );
    }

    const prices =
      await this.priceRepository.getHistory(
        stock.id,
        100
      );

    const closes =
      prices
        .reverse()
        .map(p => p.close);

    return this.rsiEngine.calculate(
      closes
    );
  }
}
