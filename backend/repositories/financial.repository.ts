import { prisma } from '../utils/prisma';

export class FinancialRepository {

  async save(data: {
  stockId: number;

  reportDate: Date;

  revenue?: number;
  netIncome?: number;

  debt?: number;
  cash?: number;

  eps?: number;

  peRatio?: number;
  pbRatio?: number;

  roe?: number;
  roce?: number;

  revenueGrowth?: number;
  earningGrowth?: number;
  currentRatio?: number;
}) {

    return prisma.financialMetric.create({
      data
    });
  }

  async latest(
    stockId: number
  ) {

    return prisma.financialMetric.findFirst({
      where: {
        stockId
      },

      orderBy: {
        reportDate: 'desc'
      }
    });
  }
}
