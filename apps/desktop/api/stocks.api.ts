export async function getTopStocks() {

  const response =
    await fetch(
      'http://127.0.0.1:3000/api/stocks/top'
    );

  if (!response.ok) {
    throw new Error(
      `HTTP ${response.status}`
    );
  }

  return response.json();
}