import { RecommendationRepository }
from '../../backend/repositories/recommendation.repository';

async function run() {

  const repo =
    new RecommendationRepository();

  const data =
    await repo.latest();

  console.dir(
    data,
    { depth: null }
  );
}

run();
