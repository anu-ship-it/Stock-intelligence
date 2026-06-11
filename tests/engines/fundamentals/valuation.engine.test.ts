import { ValuationEngine }
from '../../../backend/engines/fundamentals/valuation.engine';

const engine =
  new ValuationEngine();

console.log(
  'AAPL:',
  engine.calculate({
    peRatio: 35.85,
    pbRatio: 40.74
  })
);

console.log(
  'MSFT:',
  engine.calculate({
    peRatio: 23.13,
    pbRatio: 6.97
  })
);
