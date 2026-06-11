import { AnalysisRepository }
  from '../repositories/analysis.repository';

export class AnalysisService {

  private repository =
    new AnalysisRepository();

  async getTopStocks(
    limit = 20
  ) {

    return this.repository
      .topStocks(limit);
  }
}
