import { AnalysisRepository }
  from '../../repositories/analysis.repository';

export class StocksController {

  private analysisRepository =
    new AnalysisRepository();

  async topStocks(
    req: any,
    res: any
  ) {

    const stocks =
      await this.analysisRepository
        .topStocks();

    res.json(
      stocks.map(item => ({
        symbol:
          item.stock.symbol,

        technicalScore:
          item.score.technicalScore,

        fundamentalScore:
          item.score.fundamentalScore,

        finalScore:
          item.score.finalScore
      }))
    );
  }
}
