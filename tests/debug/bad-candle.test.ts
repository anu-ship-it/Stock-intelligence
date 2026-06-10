import { prisma }
from '../../backend/utils/prisma';

async function run() {

  const row =
    await prisma.dailyPrice.findFirst({
      where: {
        stockId: 2,
        close: 0
      }
    });

  console.dir(
    row,
    { depth: null }
  );
}

run();
