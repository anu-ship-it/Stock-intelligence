export interface ScanResult {
  symbol: string;
  score: number;
  currentPrice: number;
  rsi: number;
  ema20: number;
  ema50: number;
  macd: number;
  signal: number;
  histogram: number;
}