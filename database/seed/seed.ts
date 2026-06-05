import { prisma } from '../../backend/utils/prisma';

async function main() {
  console.log('Seeding database...');

  await prisma.market.upsert({
    where: {
      id: 1
    },
    update: {},
    create: {
      name: 'NSE',
      country: 'India',
      currency: 'INR'
    }
  });

  await prisma.market.upsert({
    where: {
      id: 2
    },
    update: {},
    create: {
      name: 'NASDAQ',
      country: 'USA',
      currency: 'USD'
    }
  });

  console.log('Seed completed.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
  