import { PageStat } from './page-stat';

export type PerMonthReadingTime = {
  month: string;
  duration: number;
  date: number;
};

export type PerDayOfTheWeek = {
  name: string;
  value: number;
  day: number;
  index: number;
};

export type GetAllStatsResponse = {
  stats: PageStat[];
  perMonth: PerMonthReadingTime[];
  perDayOfTheWeek: PerDayOfTheWeek[];
};
