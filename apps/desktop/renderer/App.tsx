import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';

import Dashboard
  from '../pages/Dashboard';

import StockDetail
  from '../pages/StockDetail';

export default function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/stocks/:symbol"
          element={<StockDetail />}
        />

      </Routes>

    </BrowserRouter>

  );
}