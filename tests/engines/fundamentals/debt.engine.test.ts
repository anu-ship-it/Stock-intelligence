import { DebtEngine }
from '../../../backend/engines/fundamentals/debt.engine';

const engine =
  new DebtEngine();

console.log(
  'Debt:',
  engine.calculate()
);
