import { ScorePersistenceService }
from '../../backend/services/score-persistence.service';

async function run() {

  const service =
    new ScorePersistenceService();

  const result =
    await service.save(
      'AAPL',
      {
        technicalScore: 50
      }
    );

  console.dir(
    result,
    { depth: null }
  );
}

run();
