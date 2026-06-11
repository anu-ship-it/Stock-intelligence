import { GrowthEngine }
from '../../../backend/engines/fundamentals/growth.engine';

const engine =
  new GrowthEngine();

console.log(
  'Growth:',
  engine.calculate()
);