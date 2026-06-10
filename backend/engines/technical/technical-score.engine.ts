export class TechnicalScoreEngine {
  calculate(data: {
    rsi: number;
    ema20: number;
    ema50: number;
    macd: number;
    signal: number;
    currentPrice: number;
  }) {
    let score = 0;

    // RSI

    if (data.rsi >= 50 && data.rsi <= 70) {
      score += 25;
    } else if (data.rsi >= 40) {
      score += 15;
    } else if (data.rsi > 70) {
      score += 5;
    }

    // EMA Trend

    if (data.ema20 > data.ema50) {
      score += 25;
    }

    // MACD

    if (data.macd > data.signal) {
      score += 25;
    }

    // Price Trend

    if (data.currentPrice > data.ema20) {
      score += 25;
    }

    return score;
  }
}
