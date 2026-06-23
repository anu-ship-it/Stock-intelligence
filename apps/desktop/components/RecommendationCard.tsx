type Recommendation = {
  symbol: string;
  recommendation: string;
  confidence: number;
};

export default function RecommendationCard({
  recommendations
}: {
  recommendations: Recommendation[];
}) {

  return (

    <div>

      <h2>
        Latest Recommendations
      </h2>

      <table
        border={1}
        cellPadding={10}
      >

        <thead>
          <tr>
            <th>Symbol</th>
            <th>Recommendation</th>
            <th>Confidence</th>
          </tr>
        </thead>

        <tbody>

          {recommendations.map(item => (

            <tr
              key={`${item.symbol}-${item.recommendation}`}
            >

              <td>
                {item.symbol}
              </td>

              <td>
                {item.recommendation}
              </td>

              <td>
                {item.confidence}%
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}
