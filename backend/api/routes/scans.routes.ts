import { Router }
  from 'express';

import { ScansController }
  from '../controllers/scans.controller';

const router =
  Router();

const controller =
  new ScansController();

router.post(
  '/',
  (
    req,
    res
  ) =>
    controller.run(
      req,
      res
    )
);

export default router;