import { Router }
    from 'express';

import { StocksController }
    from '../controllers/stocks.controller';

const router =
    Router();

const controller =
    new StocksController();

router.get(
    '/top',
    (
        req,
        res
    ) =>
        controller.topStocks(
            req,
            res
        )
);

router.get(
    '/:symbol/analysis',
    (
        req,
        res
    ) =>
        controller.analysis(
            req,
            res
        )
);

router.get(
    '/:symbol',
    (
        req,
        res
    ) =>
        controller.stockBySymbol(
            req,
            res
        )
);

export default router;

