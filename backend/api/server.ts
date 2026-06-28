import express
  from 'express';

import cors
  from 'cors';

import stocksRoutes
  from './routes/stocks.routes';

import recommendationsRoutes
  from './routes/recommendations.routes';

import scansRoutes
  from './routes/scans.routes';

const app =
  express();

const PORT =
  3000;

console.log('SERVER VERSION 2');

app.use(cors());

app.use(
  express.json()
);

// Health Check
app.get(
  '/health',
  (
    req,
    res
  ) => {
    res.json({
      ok: true
    });
  }
);

// Routes
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

// Start Server
app.listen(
  PORT,
  () => {
    console.log(
      `API running on port ${PORT}`
    );
  }
);
