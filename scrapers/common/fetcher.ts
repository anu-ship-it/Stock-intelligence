import axios from 'axios';

export const fetcher = axios.create({
  timeout: 30000,
  headers: {
    'User-Agent':
      'Mozilla/5.0 Stock Intelligence Bot'
  }
});
