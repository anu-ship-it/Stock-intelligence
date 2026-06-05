import { prisma } from '../utils/prisma';

export class RecommendationRepository {
  async create(data: {
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

  async latest(limit = 20) {
    return prisma.recommendation.findMany({
      take: limit,
      orderBy: {
        scanDate: 'desc',
      },
      include: {
        stock: true,
      },
    });
  }
}
