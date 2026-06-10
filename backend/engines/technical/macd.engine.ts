import { MACD } from 'technicalindicators';

export class MACDEngine {
  calculate(closes: number[]) {

    const result = MACD.calculate({
      values: closes,
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
      SimpleMAOscillator: false,
      SimpleMASignal: false
    });

    return result.at(-1);
  }
}
