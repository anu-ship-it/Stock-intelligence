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

    const latest = result.at(-1);

if (!latest) {
  return null;
}

return {
  MACD: latest.MACD ?? 0,
  signal: latest.signal ?? 0,
  histogram: latest.histogram ?? 0
};
  }
}
