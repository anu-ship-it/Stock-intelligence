import {
  useEffect,
  useState
} from 'react';

import {
  getRecommendations
} from '../api/recommendations.api';

export function useRecommendations() {

  const [recommendations, setRecommendations] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  useEffect(() => {

    async function load() {

      try {

        const data =
          await getRecommendations();

        setRecommendations(data);

      } catch (err) {

        setError(
          String(err)
        );

      } finally {

        setLoading(false);

      }
    }

    load();

  }, []);

  return {
    recommendations,
    loading,
    error
  };
}
