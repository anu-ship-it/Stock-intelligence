import express
  from 'express';

import cors from 'cors';

import stocksRoutes
  from './routes/stocks.routes';

import recommendationsRoutes
  from './routes/recommendations.routes';

import scansRoutes
  from './routes/scans.routes';


const app =
  express();

console.log('SERVER VERSION 2'); 
app.use(cors()) ; 

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
