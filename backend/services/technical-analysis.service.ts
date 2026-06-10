import { StockRepository } from '../repositories/stock.repository';
import { PriceRepository } from '../repositories/price.repository';

import { RSIEngine } from '../engines/technical/rsi.engine';
import { EMAEngine } from '../engines/technical/ema.engine';
import { MACDEngine } from '../engines/technical/macd.engine';
import { TechnicalScoreEngine } from '../engines/technical/technical-score.engine';

export class TechnicalAnalysisService {

  private stockRepository =
    new StockRepository();

  private priceRepository =
    new PriceRepository();

  private rsiEngine =
    new RSIEngine();

  private emaEngine =
    new EMAEngine();

  private macdEngine =
    new MACDEngine();

  private technicalScoreEngine =
    new TechnicalScoreEngine();

  async analyze(symbol: string) {

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
        250
      );

      const closes =
      prices
        .reverse()
        .map(p => p.close);


    if (prices.length < 60) {
      throw new Error(
        `Not enough price history for ${symbol}`
      );
    }

    const currentPrice =
      closes[closes.length - 1];

    const rsi =
      this.rsiEngine.calculate(
        closes
      );

    const ema20 =
      this.emaEngine.calculate(
        closes,
        20
      );

    const ema50 =
      this.emaEngine.calculate(
        closes,
        50
      );

    const macdResult =
      this.macdEngine.calculate(
        closes
      );

    if (!macdResult) {
      throw new Error(
        'Unable to calculate MACD'
      );
    }

    const score =
      this.technicalScoreEngine.calculate({
        rsi,
        ema20,
        ema50,
        macd: macdResult.MACD,
        signal: macdResult.signal,
        currentPrice
      });

    return {
      symbol,

      currentPrice,

      rsi,

      ema20,

      ema50,

      macd: macdResult.MACD,

      signal: macdResult.signal,

      histogram:
        macdResult.histogram,

      score
    };
  }
}
