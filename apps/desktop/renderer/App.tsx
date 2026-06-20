import { BrowserRouter, Routes, Route }
  from 'react-router-dom';

import Dashboard
  from '../pages/Dashboard';

import StockDetail
  from '../pages/StockDetail';

import Reports
  from '../pages/Reports';

import Settings
  from '../pages/Settings';

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

        <Route
          path="/reports"
          element={<Reports />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />

      </Routes>

    </BrowserRouter>
  );
}
