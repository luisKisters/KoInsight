import useSWR from 'swr';
import { fetchFromAPI } from './api';

export type PageStat = {
  book_id: number;
  page: number;
  start_time: number;
  duration: number;
  total_pages: number;
};

export function usePageStats() {
  return useSWR('stats', () => fetchFromAPI<PageStat[]>('stats'), { fallbackData: [] });
}

export function useBookStats(bookId: number) {
  return useSWR(`stats/${bookId}`, () => fetchFromAPI<PageStat[]>(`stats/${bookId}`));
}
