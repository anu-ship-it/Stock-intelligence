import { RSIEngine } from '../../backend/technical/rsi.engine';

async function run() {

  const closes = [
    44.34,
    44.09,
    44.15,
    43.61,
    44.33,
    44.83,
    45.10,
    45.42,
    45.84,
    46.08,
    45.89,
    46.03,
    45.61,
    46.28,
    46.28
  ];

  const engine = new RSIEngine();

  const rsi = engine.calculate(closes);

  console.log('RSI:', rsi);
}

run();
