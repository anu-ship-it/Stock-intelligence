import { ScoreRepository }
  from '../../backend/repositories/score.repository';

async function run() {

  const repo =
    new ScoreRepository();

  const score =
    await repo.latest(1);

  console.dir(
    score,
    { depth: null }
  );
}

run();