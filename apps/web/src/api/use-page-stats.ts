import { PageStat } from '@koinsight/common/types/page-stat';
import useSWR from 'swr';
import { fetchFromAPI } from './api';
import { GetAllStatsResponse } from '@koinsight/common/types';

export function usePageStats() {
  return useSWR('stats', () => fetchFromAPI<GetAllStatsResponse>('stats'), {
    fallbackData: { stats: [], perMonth: [], perDayOfTheWeek: [] },
  });
}

export function useBookStats(bookMd5: string) {
  return useSWR(`stats/${bookMd5}`, () => fetchFromAPI<PageStat[]>(`stats/${bookMd5}`));
}
