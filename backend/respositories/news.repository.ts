import { prisma } from '../utils/prisma';

export class PriceRepository {
  async createPrice(data: {
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
      update: {
        open: data.open,
        high: data.high,
        low: data.low,
        close: data.close,
        volume: data.volume,
      },
    });
  }

  async getHistory(stockId: number, limit = 250) {
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
