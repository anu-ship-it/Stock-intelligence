import { EMAEngine } from "./ema.engine.test";

async function run() {
  const engine = new EMAEngine();

  const closes = [
    100,101,102,103,104,
    105,106,107,108,109,
    110,111,112,113,114,
    115,116,117,118,119
  ];

  console.log(
    engine.calculate(closes, 10)
  );
}

run();