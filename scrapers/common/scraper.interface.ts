export interface Scraper<T> {
  scrape(): Promise<T[]>;
}
