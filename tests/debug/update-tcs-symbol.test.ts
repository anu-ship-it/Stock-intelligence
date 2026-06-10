import { prisma }
from '../../backend/utils/prisma';

async function run() {

  await prisma.stock.update({
    where: {
      id: 1
    },
    data: {
      yahooSymbol: 'TCS.NS'
    }
  });

  console.log('updated');
}

run();
