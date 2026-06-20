type Props = {
  stocks: any[];
};

export default function StockTable({
  stocks
}: Props) {

  return (

    <table>

      <thead>

        <tr>
          <th>Symbol</th>
          <th>Score</th>
        </tr>

      </thead>

      <tbody>

        {
          stocks.map(stock => (

            <tr key={stock.symbol}>

              <td>
                {stock.symbol}
              </td>

              <td>
                {stock.finalScore}
              </td>

            </tr>

          ))
        }

      </tbody>

    </table>

  );
}
