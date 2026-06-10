import { prisma }
from '../../backend/utils/prisma';

async function run() {

  const result =
    await prisma.dailyPrice.deleteMany({
      where: {
        close: 0
      }
    });

  console.log(result);
}

run();
