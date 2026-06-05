import { prisma } from '../utils/prisma';

export class PriceRepository {
  async upsertPrice(data: {
    stockId: number;
    date: Date;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }) {
    return prisma.dailyPrice.upsert({
      where: {
        stockId_date: {
          stockId: data.stockId,
          date: data.date,
        },
      },
      create: data,
      update: data,
    });
  }

  async getHistory(
    stockId: number,
    limit = 250
  ) {
    return prisma.dailyPrice.findMany({
      where: {
        stockId,
      },
      orderBy: {
        date: 'desc',
      },
      take: limit,
    });
  }
}
