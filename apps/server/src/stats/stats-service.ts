import { PageStat, PerDayOfTheWeek, PerMonthReadingTime } from '@koinsight/common/types';
import { format } from 'date-fns';

export class StatsService {
  static getPerMonthReadingTime(stats: PageStat[]): PerMonthReadingTime[] {
    const perMonth = (stats ?? [])
      .reduce<{ month: string; duration: number; date: number }[]>((acc, stat) => {
        const month = format(stat.start_time, 'MMMM yyyy');
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

  static perDayOfTheWeek(stats: PageStat[]): PerDayOfTheWeek[] {
    return stats
      .reduce(
        (acc, stat) => {
          const day = format(stat.start_time, 'EEEE');
          const existingDay = acc.find((d) => d.name === day);
          if (existingDay) {
            existingDay.value += stat.duration;
          } else {
            acc.push({
              name: day,
              value: stat.duration,
              day: new Date(stat.start_time).getUTCDay(),
              index: 1,
            });
          }
          return acc;
        },
        [] as Array<{ name: string; value: number; day: number; index: number }>
      )
      .sort((a, b) => a.day - b.day);
  }
}
