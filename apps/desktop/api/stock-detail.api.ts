export async function getOverview(
  symbol: string
) {

  const response =
    await fetch(
      `http://localhost:3000/api/stocks/${symbol}/overview`
    );

  if (!response.ok) {
    throw new Error(
      `HTTP ${response.status}`
    );
  }

  return response.json();
}