import { MACDEngine } from '../../../backend/engines/technical/macd.engine';

async function run() {
  const closes = [];

  for (let i = 100; i <= 160; i++) {
    closes.push(i);
  }

  const engine = new MACDEngine();

  const macd = engine.calculate(closes);

  console.log(macd);
}

run();
