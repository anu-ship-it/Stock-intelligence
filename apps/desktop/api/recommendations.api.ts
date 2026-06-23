export async function getRecommendations() {

  const response =
    await fetch(
      'http://localhost:3000/api/recommendations/top'
    );

  if (!response.ok) {
    throw new Error(
      `HTTP ${response.status}`
    );
  }

  return response.json();
}