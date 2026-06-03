import { prisma } from '../utils/prisma';

export class StockRepository {
  async create(data: {
    symbol: string;
    companyName: string;
    marketId: number;
    sector?: string;
    industry?: string;
    marketCap?: number;
  }) {
    return prisma.stock.create({
      data,
    });
  }

  async findBySymbol(symbol: string) {
    return prisma.stock.findFirst({
      where: {
        symbol,
      },
    });
  }

  async getAll() {
    return prisma.stock.findMany({
      orderBy: {
        symbol: 'asc',
      },
    });
  }

  async updateMarketCap(stockId: number, marketCap: number) {
    return prisma.stock.update({
      where: {
        id: stockId,
      },
      data: {
        marketCap,
      },
    });
  }
}
