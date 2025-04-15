import { PageStat } from '@koinsight/common/types';
import { format } from 'date-fns';

export type PerMonthReadingTime = {
  month: string;
  duration: number;
  date: number;
};

export class StatsService {
  static getPerMonthReadingTime(stats: PageStat[]): PerMonthReadingTime[] {
    const perMonth = (stats ?? [])
      .reduce<{ month: string; duration: number; date: number }[]>((acc, stat) => {
        const month = format(stat.start_time * 1000, 'MMMM yyyy');
        const monthData = acc.find((item) => item.month === month);
        if (monthData) {
          monthData.duration += stat.duration;
        } else {
          acc.push({ month, duration: stat.duration, date: stat.start_time });
        }

        return acc;
      }, [])
      .sort((a, b) => a.date - b.date);

    return perMonth;
  }
}
