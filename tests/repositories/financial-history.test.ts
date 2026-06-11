import { prisma }
from '../../backend/utils/prisma';

async function run() {

  const rows =
    await prisma.financialMetric.findMany({
      orderBy: {
        reportDate: 'desc'
      }
    });

  console.table(
    rows.map(r => ({
      stockId: r.stockId,
      pe: r.peRatio,
      pb: r.pbRatio,
      roe: r.roe
    }))
  );
}

run();
