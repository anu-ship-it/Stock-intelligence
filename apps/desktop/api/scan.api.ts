export async function runScan() {

  const response =
    await fetch(
      'http://localhost:3000/api/scan',
      {
        method: 'POST'
      }
    );

  if (!response.ok) {
    throw new Error(
      `HTTP ${response.status}`
    );
  }

  return response.json();
}