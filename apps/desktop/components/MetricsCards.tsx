type Props = {
  stocksTracked: number;
  topPick: string;
  recommendations: number;
};

export default function MetricsCards({
  stocksTracked,
  topPick,
  recommendations
}: Props) {

  return (

    <div
      style={{
        display: 'flex',
        gap: '20px',
        marginBottom: '20px'
      }}
    >

      <div
        style={{
          border: '1px solid #ccc',
          padding: '15px',
          minWidth: '180px'
        }}
      >
        <h3>Stocks Tracked</h3>
        <p>{stocksTracked}</p>
      </div>

      <div
        style={{
          border: '1px solid #ccc',
          padding: '15px',
          minWidth: '180px'
        }}
      >
        <h3>Top Pick</h3>
        <p>{topPick}</p>
      </div>

      <div
        style={{
          border: '1px solid #ccc',
          padding: '15px',
          minWidth: '180px'
        }}
      >
        <h3>Recommendations</h3>
        <p>{recommendations}</p>
      </div>

    </div>
  );
}
