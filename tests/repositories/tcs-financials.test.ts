import { prisma }
from '../../backend/utils/prisma';

async function run() {

  const rows =
    await prisma.financialMetric.findMany({
      where: {
        stockId: 1
      },
      orderBy: {
        reportDate: 'desc'
      }
    });

  console.dir(rows, {
    depth: null
  });
}

run();
