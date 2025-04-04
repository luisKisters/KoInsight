import { BookWithGenres } from '@/common/types/book';
import useSWR from 'swr';
import { fetchFromAPI } from './api';
import { PageStat } from './use-page-stats';

type Stats = {
  stats: PageStat[];
  started_reading: number;
  last_read: number;
  read_per_day: Record<string, number>;
};

export type BookWithStats = BookWithGenres & Stats;

export function useBookWithStats(id: number) {
  return useSWR(`books/${id}`, () => fetchFromAPI<BookWithStats>(`books/${id}`));
}
