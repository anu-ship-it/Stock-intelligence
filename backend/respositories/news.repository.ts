import { prisma } from '../utils/prisma';

export class NewsRepository {
  async upsertArticle(data: {
    stockId?: number;
    headline: string;
    summary?: string;
    source: string;
    url: string;
    publishedAt: Date;
  }) {
    return prisma.newsArticle.upsert({
      where: {
        url: data.url,
      },
      create: data,
      update: {},
    });
  }

  async getLatestNews(
    stockId: number,
    limit = 20
  ) {
    return prisma.newsArticle.findMany({
      where: {
        stockId,
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take: limit,
    });
  }
}
