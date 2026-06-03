import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.market.createMany({
    data: [
      {
        name: 'NSE',
        country: 'India',
        currency: 'INR',
      },
      {
        name: 'NASDAQ',
        country: 'USA',
        currency: 'USD',
      },
    ],
  });

  console.log('Seed Complete');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
  