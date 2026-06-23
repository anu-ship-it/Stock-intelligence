import { prisma }
  from '../utils/prisma';

export class StockOverviewRepository {

  async get(
    symbol: string
  ) {

    return prisma.stock.findFirst({

      where: {
        symbol
      },

      include: {

        financials: {
          orderBy: {
            reportDate: 'desc'
          },
          take: 1
        },

        scores: {
          orderBy: {
            scanDate: 'desc'
          },
          take: 1
        },

        recommendations: {
          orderBy: {
            scanDate: 'desc'
          },
          take: 1
        }
      }
    });
  }
}