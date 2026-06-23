import { AnalysisRepository }
    from '../../repositories/analysis.repository';

import { StockRepository }
    from '../../repositories/stock.repository';

import { CombinedAnalysisService }
    from '../../services/combined-analysis.service';

import { StockOverviewRepository }
    from '../../repositories/stock-overview.repository';

export class StocksController {

    private analysisRepository =
        new AnalysisRepository();

    private stockRepository =
        new StockRepository();

    private combinedAnalysisService =
        new CombinedAnalysisService();

    private stockOverviewRepository =
        new StockOverviewRepository();

    async overview(
        req: any,
        res: any
    ) {

        const symbol =
            req.params.symbol;

        const result =
            await this.stockOverviewRepository
                .get(symbol);

        if (!result) {

            return res.status(404)
                .json({
                    error:
                        'Stock not found'
                });
        }

        res.json(result);
    }

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

    async stockBySymbol(
        req: any,
        res: any
    ) {

        const symbol =
            req.params.symbol;

        const stock =
            await this.stockRepository
                .findBySymbol(symbol);

        if (!stock) {

            return res.status(404)
                .json({
                    error:
                        'Stock not found'
                });
        }

        res.json(stock);
    }


    async analysis(
        req: any,
        res: any
    ) {

        const symbol =
            req.params.symbol;

        try {

            const result =
                await this.combinedAnalysisService
                    .analyze(symbol);

            res.json(result);

        } catch (error: any) {

            res.status(500).json({
                error:
                    error.message
            });

        }
    }
}
