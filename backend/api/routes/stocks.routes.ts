import { Router }
    from 'express';

import { StocksController }
    from '../controllers/stocks.controller';

const router =
    Router();
    console.log('stocks.routes loaded');

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
  '/:symbol/overview',
  (
    req,
    res
  ) =>
    controller.overview(
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

router.get(
  '/test',
  (
    req,
    res
  ) => {
    res.json({
      success: true
    });
  }
);

export default router;

