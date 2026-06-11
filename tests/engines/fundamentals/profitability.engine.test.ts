import { ProfitabilityEngine }
from '../../../backend/engines/fundamentals/profitability.engine';

const engine =
  new ProfitabilityEngine();

console.log(
  'AAPL:',
  engine.calculate({
    roe: 1.41
  })
);

console.log(
  'MSFT:',
  engine.calculate({
    roe: 0.34
  })
);

console.log(
  'BAD:',
  engine.calculate({
    roe: 0.05
  })
);

console.log(
  'NONE:',
  engine.calculate({})
);
