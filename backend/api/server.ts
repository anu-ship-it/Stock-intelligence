import express
  from 'express';

import stocksRoutes
  from './routes/stocks.routes';

const app =
  express();

app.use(
  express.json()
);

app.use(
  '/api/stocks',
  stocksRoutes
);

const PORT =
  3000;

app.listen(
  PORT,
  () => {
    console.log(
      `API running on port ${PORT}`
    );
  }
);
