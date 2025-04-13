import { PageStat } from '@koinsight/common/types/page-stat';
import useSWR from 'swr';
import { fetchFromAPI } from './api';

export function usePageStats() {
  return useSWR('stats', () => fetchFromAPI<PageStat[]>('stats'), { fallbackData: [] });
}

export function useBookStats(bookMd5: string) {
  return useSWR(`stats/${bookMd5}`, () => fetchFromAPI<PageStat[]>(`stats/${bookMd5}`));
}
