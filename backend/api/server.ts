import express
  from 'express';

import stocksRoutes
  from './routes/stocks.routes';

import recommendationsRoutes
  from './routes/recommendations.routes';  

import scansRoutes
  from './routes/scans.routes';


const app =
  express();

app.use(
  express.json()
);

app.use(
  '/api/stocks',
  stocksRoutes
);

app.use(
  '/api/recommendations',
  recommendationsRoutes
);

app.use(
  '/api/scan',
  scansRoutes
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
