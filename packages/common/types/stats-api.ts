import { PageStat } from './page-stat';

export type GetAllStatsResponse = {
  stats: PageStat[];
  per_month: Array<{ month: string; duration: number; date: number }>;
};
