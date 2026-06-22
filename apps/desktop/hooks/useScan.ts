import { useState }
  from 'react';

import {
  runScan
} from '../api/scan.api';

export function useScan() {

  const [loading, setLoading] =
    useState(false);

  async function scan() {

    try {

      setLoading(true);

      const result =
        await runScan();

      return result;

    } finally {

      setLoading(false);

    }
  }

  return {
    scan,
    loading
  };
}