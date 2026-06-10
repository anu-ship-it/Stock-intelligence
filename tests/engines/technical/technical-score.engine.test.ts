import { TechnicalScoreEngine }
from '../../../backend/engines/technical/technical-score.engine';

async function run() {

  const engine =
    new TechnicalScoreEngine();

  const score =
    engine.calculate({
      rsi: 58,
      ema20: 211,
      ema50: 203,
      macd: 1.4,
      signal: 1.1,
      currentPrice: 220
    });

  console.log(
    'Technical Score:',
    score
  );
}

run();
