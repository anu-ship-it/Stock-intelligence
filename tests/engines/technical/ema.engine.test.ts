import { EMAEngine } from '../../../backend/engines/technical/ema.engine';

async function run() {
  const closes = [
    100,101,102,103,104,
    105,106,107,108,109,
    110,111,112,113,114,
    115,116,117,118,119
  ];

  const engine = new EMAEngine();

  const ema20 =
    engine.calculate(closes, 20);

  console.log(
    'EMA20:',
    ema20
  );
}

run();
