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

export default router;
