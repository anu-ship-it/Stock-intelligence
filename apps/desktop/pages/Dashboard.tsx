
import { useStocks }
  from '../hooks/useStocks';

export default function Dashboard() {
console.log('Dashboard rendered');
  const {
  stocks,
  loading,
  error
} = useStocks();

if (loading) {
  return <div>Loading...</div>;
}

if (error) {
  return <div>{error}</div>;
}

  return (

    <div>

      <h1>
        PennyScope
      </h1>

      <pre>
        {
          JSON.stringify(
            stocks,
            null,
            2
          )
        }
      </pre>

    </div>
  );
}