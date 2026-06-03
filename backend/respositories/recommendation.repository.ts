import { prisma } from '../utils/prisma';

export class RecommendationRepository {
  async createRecommendation(data: {
    stockId: number;
    scanDate: Date;
    recommendation: string;
    confidence: number;
    entryPrice?: number;
    targetPrice?: number;
    stopLoss?: number;
    summary?: string;
  }) {
    return prisma.recommendation.create({
      data,
    });
  }

  async latestRecommendations(limit = 20) {
    return prisma.recommendation.findMany({
      orderBy: {
        scanDate: 'desc',
      },
      take: limit,
      include: {
        stock: true,
      },
    });
  }
}
