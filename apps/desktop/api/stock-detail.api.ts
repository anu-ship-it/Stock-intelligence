export async function getStock(
  symbol: string
) {

  const response =
    await fetch(
      `http://localhost:3000/api/stocks/${symbol}`
    );

  return response.json();
}

export async function getAnalysis(
  symbol: string
) {

  const response =
    await fetch(
      `http://localhost:3000/api/stocks/${symbol}/analysis`
    );

  return response.json();
}