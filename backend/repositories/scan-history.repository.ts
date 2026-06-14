import { prisma } from '../utils/prisma';

export class ScanHistoryRepository {

  async create(data: {
    startedAt: Date;
    totalStocks: number;
    successfulStocks: number;
    failedStocks: number;
    status: string;
  }) {

    return prisma.scanHistory.create({
      data
    });
  }

  async complete(
    id: number,
    data: {
      completedAt: Date;
      successfulStocks: number;
      failedStocks: number;
      status: string;
    }
  ) {

    return prisma.scanHistory.update({
      where: {
        id
      },
      data
    });
  }

  async latest(limit = 20) {

    return prisma.scanHistory.findMany({
      take: limit,
      orderBy: {
        startedAt: 'desc'
      }
    });
  }
}
