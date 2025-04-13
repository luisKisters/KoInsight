import { BookWithGenres } from '@koinsight/common/types/book';
import { PageStat } from '@koinsight/common/types/page-stat';
import useSWR from 'swr';
import { fetchFromAPI } from './api';

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
