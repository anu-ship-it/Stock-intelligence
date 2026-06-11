import { prisma } from '../utils/prisma';

export class AnalysisRepository {

  async topStocks() {

    const stocks =
      await prisma.stock.findMany({
        include: {
          scores: {
            orderBy: {
              scanDate: 'desc'
            },
            take: 1
          }
        }
      });

    return stocks
      .filter(
        stock => stock.scores.length > 0
      )
      .map(stock => ({
        stock,
        score: stock.scores[0]
      }))
      .sort(
        (a, b) =>
          b.score.finalScore -
          a.score.finalScore
      );
  }
}