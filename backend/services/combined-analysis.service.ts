import { TechnicalAnalysisService }
  from './technical-analysis.service';

import { FundamentalAnalysisService }
  from './fundamental-analysis.service';

export class CombinedAnalysisService {

  private technicalAnalysisService =
    new TechnicalAnalysisService();

  private fundamentalAnalysisService =
    new FundamentalAnalysisService();

  async analyze(
    symbol: string
  ) {

    const technical =
      await this.technicalAnalysisService
        .analyze(symbol);

    const fundamental =
      await this.fundamentalAnalysisService
        .analyze(symbol);

    const finalScore =
      (
        technical.score +
        fundamental.score
      ) / 2;

    return {
      symbol,

      technicalScore:
        technical.score,

      fundamentalScore:
        fundamental.score,

      finalScore
    };
  }
}