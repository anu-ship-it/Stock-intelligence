import { Router }
  from 'express';

import { RecommendationsController }
  from '../controllers/recommendations.controller';

const router =
  Router();

const controller =
  new RecommendationsController();

router.get(
  '/top',
  (
    req,
    res
  ) =>
    controller.top(
      req,
      res
    )
);

export default router;
