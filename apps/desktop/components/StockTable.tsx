import { Link } from "react-router-dom";

type Stock = {
  symbol: string;
  technicalScore: number;
  fundamentalScore: number;
  finalScore: number;
};

export default function StockTable({ stocks }: { stocks: Stock[] }) {
  return (
    <table border={1} cellPadding={10}>
      <thead>
        <tr>
          <th>Symbol</th>
          <th>Technical</th>
          <th>Fundamental</th>
          <th>Final</th>
        </tr>
      </thead>

      <tbody>
        {stocks.map((stock) => (
          <tr key={stock.symbol}>
            <td>
              <Link to={`/stocks/${stock.symbol}`}>{stock.symbol}</Link>
            </td>

            <td>{stock.technicalScore}</td>

            <td>{stock.fundamentalScore}</td>

            <td>{stock.finalScore}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
