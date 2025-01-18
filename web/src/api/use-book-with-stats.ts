import useSWR from 'swr';
import { fetchFromAPI } from './api';
import { PageStat } from './use-page-stats';
import { Book } from './use-books';

export type BookWithStats = Book & {
  stats: PageStat[];
  started_reading: number;
  last_read: number;
  read_per_day: Record<string, number>;
};

export function useBookWithStats(id: number) {
  return useSWR(`books/${id}`, () => fetchFromAPI<BookWithStats>(`books/${id}`));
}
