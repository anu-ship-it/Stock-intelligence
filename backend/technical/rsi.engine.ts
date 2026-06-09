import { RSI } from 'technicalindicators';

export class RSIEngine {
  calculate(closes: number[]) {
    const result = RSI.calculate({
      values: closes,
      period: 14
    });

    return result.at(-1) ?? 0;
  }
}
