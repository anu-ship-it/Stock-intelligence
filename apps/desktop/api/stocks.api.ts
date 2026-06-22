export async function getTopStocks() {

  console.log(
    'calling API'
  );

  const response =
    await fetch(
      'http://127.0.0.1:3000/api/stocks/top'
    );

  console.log(
    'response',
    response.status
  );

  if (!response.ok) {
    throw new Error(
      `HTTP ${response.status}`
    );
  }

  return response.json();
}