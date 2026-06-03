import { prisma } from '../utils/prisma';

export class ScoreRepository {
  async saveScore(data: {
    stockId: number;
    scanDate: Date;
    technicalScore: number;
    fundamentalScore: number;
    sentimentScore: number;
    riskScore: number;
    finalScore: number;
  }) {
    return prisma.stockScore.create({
      data,
    });
  }

  async latestScore(stockId: number) {
    return prisma.stockScore.findFirst({
      where: {
        stockId,
      },
      orderBy: {
        scanDate: 'desc',
      },
    });
  }
}
