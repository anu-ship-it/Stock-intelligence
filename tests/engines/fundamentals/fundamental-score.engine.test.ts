import { FundamentalScoreEngine }
from '../../../backend/engines/fundamentals/fundamental-score.engine';

const engine =
  new FundamentalScoreEngine();

console.log(
  engine.calculate({
    valuation: 100,
    profitability: 100,
    growth: 50,
    debt: 50
  })
);