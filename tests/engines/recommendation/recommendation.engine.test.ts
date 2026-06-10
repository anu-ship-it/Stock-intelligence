import { RecommendationEngine }
from '../../../backend/engines/recommendation/recommendation.engine';

const engine =
  new RecommendationEngine();

console.log(
  engine.getRecommendation(85)
);

console.log(
  engine.getRecommendation(65)
);

console.log(
  engine.getRecommendation(45)
);

console.log(
  engine.getRecommendation(25)
);

console.log(
  engine.getRecommendation(5)
);
