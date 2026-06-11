import { FinancialRepository }
from '../../backend/repositories/financial.repository';

async function run() {

  const repo =
    new FinancialRepository();

  const result =
    await repo.save({
      stockId: 2,

      reportDate:
        new Date(),

      peRatio: 35.54,

      pbRatio: 40.39,

      roe: 1.41
    });

  console.dir(
    result,
    { depth: null }
  );
}

run();
