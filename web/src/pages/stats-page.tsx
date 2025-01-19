import { BarChart } from '@mantine/charts';
import { Box, Flex, Loader, SegmentedControl, Title } from '@mantine/core';
import { format, isSameDay, startOfDay, subDays } from 'date-fns';
import { range, sum, uniqBy } from 'ramda';
import { JSX, useMemo, useState } from 'react';
import { useBooks } from '../api/use-books';
import { PageStat, usePageStats } from '../api/use-page-stats';
import { ReadingCalendar } from '../components/statistics/reading-calendar';
import { Statistics } from '../components/statistics/statistics';
import { formatSecondsToHumanReadable } from '../utils/dates';
import { IconArrowsVertical, IconClock, IconMaximize, IconPageBreak } from '@tabler/icons-react';

export function StatsPage(): JSX.Element {
  const { data: books, isLoading } = useBooks();
  const { data: stats, isLoading: statsLoading } = usePageStats();

  const [segmentedValue, setSegmentedValue] = useState<'week' | 'month'>('week');

  const lastWeek = useMemo(() => {
    const now = subDays(new Date(), 7);
    return stats?.filter((stat) => stat.start_time * 1000 > now.getTime());
  }, [stats]);

  const perMonth = useMemo(
    () =>
      (stats ?? []).reduce<{ month: string; duration: number }[]>((acc, stat) => {
        const month = format(stat.start_time * 1000, 'MMMM yyyy');
        const monthData = acc.find((item) => item.month === month);
        if (monthData) {
          monthData.duration += stat.duration;
        } else {
          acc.push({ month, duration: stat.duration });
        }

        return acc;
      }, []),
    [stats]
  );

  const perDay = useMemo(() => {
    const today = startOfDay(new Date());
    return range(0, 7)
      .reduce<{ day: string; duration: number }[]>((acc, day) => {
        console.log(day);
        const date = startOfDay(subDays(today, day));
        const dayStats = stats?.filter((stat) => isSameDay(stat.start_time * 1000, date)) ?? [];

        acc.push({
          day: format(date, 'dd MMM yyyy'),
          duration: sum(dayStats.map((s) => s.duration)),
        });

        return acc;
      }, [])
      .reverse();
  }, [stats]);

  const longestDay = useMemo(() => {
    const timePerDay = stats?.reduce<Record<number, number>>((acc, stat) => {
      const day = startOfDay(stat.start_time * 1000).getTime();
      acc[day] = (acc[day] || 0) + stat.duration;
      return acc;
    }, {});

    const maxTime = Math.max(...Object.values(timePerDay ?? []));
    return maxTime;
  }, [stats]);

  const mostPagesInADay = useMemo(() => {
    const pagesPerDay = stats?.reduce<Record<number, number>>((acc, stat) => {
      const day = startOfDay(stat.start_time * 1000).getTime();
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {});

    const maxTime = Math.max(...Object.values(pagesPerDay ?? []));
    return maxTime;
  }, [stats]);

  const totalTime = useMemo(() => sum((stats ?? []).map((s) => s.duration)), [stats]);

  if (isLoading || statsLoading || !books || !stats) {
    return (
      <Flex justify="center" align="center" h="100%">
        <Loader />
      </Flex>
    );
  }

  return (
    <div>
      <Box mb="xl">
        <ReadingCalendar />
      </Box>
      <Box mb="xl">
        <Statistics
          data={[
            {
              label: 'Total read time',
              value: formatSecondsToHumanReadable(totalTime),
              icon: IconClock,
            },
            {
              label: 'Total pages read',
              value: books.reduce((acc, book) => acc + book.total_read_pages, 0),
              icon: IconPageBreak,
            },
            {
              label: 'Longest time reading in a day',
              value: formatSecondsToHumanReadable(longestDay),
              icon: IconMaximize,
            },
            {
              label: 'Most pages in a day',
              value: mostPagesInADay,
              icon: IconMaximize,
            },
          ]}
        />
      </Box>
      <SegmentedControl
        value={segmentedValue}
        onChange={(v) => setSegmentedValue(v as 'week' | 'month')}
        data={[
          { label: 'Last 7 days', value: 'week' },
          { label: 'Monthly', value: 'month' },
        ]}
      />
      {segmentedValue === 'week' && (
        <Box mt="md">
          <Statistics
            data={[
              {
                label: 'Read time',
                value: formatSecondsToHumanReadable(
                  sum(lastWeek?.map((stat) => stat.duration) ?? [])
                ),
                icon: IconClock,
              },
              {
                label: 'Pages read',
                value: uniqBy((stat: PageStat) => stat.page)(lastWeek ?? []).length,
                icon: IconPageBreak,
              },
              {
                label: 'Average pages per day',
                value: Math.round(uniqBy((stat: PageStat) => stat.page)(lastWeek ?? []).length / 7),
                icon: IconArrowsVertical,
              },
              {
                label: 'Average time per day',
                value: formatSecondsToHumanReadable(
                  Math.round(sum(lastWeek?.map((stat) => stat.duration) ?? []) / 7)
                ),
                icon: IconClock,
              },
            ]}
          />
          <BarChart
            h={300}
            mt="xl"
            data={perDay}
            dataKey="day"
            valueFormatter={(value) => formatSecondsToHumanReadable(value)}
            series={[{ name: 'duration' }]}
            tickLine="y"
          />
        </Box>
      )}
      {segmentedValue === 'month' && (
        <BarChart
          mt="xl"
          h={300}
          data={perMonth}
          dataKey="month"
          valueFormatter={(value) => formatSecondsToHumanReadable(value)}
          series={[{ name: 'duration' }]}
          tickLine="y"
        />
      )}
    </div>
  );
}
