import useSWR from 'swr';
import { fetchFromAPI } from './api';
import { PageStat } from './use-page-stats';
import { Book } from './use-books';

export type BookWithStats = Book & { stats: PageStat[] };

export function useBookWithStats(id: number) {
  return useSWR(`books/${id}`, () => fetchFromAPI<BookWithStats>(`books/${id}`));
}
