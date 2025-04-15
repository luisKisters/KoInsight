import { PageStat } from './page-stat';

export type GetAllStatsResponse = {
  stats: PageStat[];
  perMonth: Array<{ month: string; duration: number; date: number }>;
};
