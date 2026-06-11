import { prisma } from '../utils/prisma';

export class AnalysisRepository {

  async topStocks(limit = 20) {

    return prisma.stockScore.findMany({
      take: limit,

      orderBy: {
        finalScore: 'desc'
      },

      include: {
        stock: true
      }
    });
  }
}
