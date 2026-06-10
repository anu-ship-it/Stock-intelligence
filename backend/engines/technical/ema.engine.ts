import { EMA } from 'technicalindicators';

export class EMAEngine {
  calculate(
    closes: number[],
    period: number
  ) {
    const result = EMA.calculate({
      values: closes,
      period
    });

    return result.at(-1) ?? 0;
  }
}
