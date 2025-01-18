import { BarChart } from '@mantine/charts';
import { Box, Flex, Loader, Title } from '@mantine/core';
import { format, isSameDay, startOfDay, subDays } from 'date-fns';
import { JSX, useMemo } from 'react';
import { useBooks } from '../api/use-books';
import { PageStat, usePageStats } from '../api/use-page-stats';
import { ReadingCalendar } from '../components/statistics/reading-calendar';
import { Statistics } from '../components/statistics/statistics';
import { formatSecondsToHumanReadable } from '../utils/dates';
import { range, sum, uniqBy } from 'ramda';

export function StatsPage(): JSX.Element {
  const { data: books, isLoading } = useBooks();
  const { data: stats, isLoading: statsLoading } = usePageStats();

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

  const totalTime = useMemo(
    () => (stats ?? []).reduce((acc, stat) => acc + stat.duration, 0),
    [stats]
  );

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
        <Title order={3} mb="lg">
          Overall Statistics
        </Title>
        <Statistics
          data={[
            {
              label: 'Total read time',
              value: formatSecondsToHumanReadable(totalTime),
            },
            {
              label: 'Total pages read',
              value: books.reduce((acc, book) => acc + book.total_read_pages, 0),
            },
            {
              label: 'Longest time reading in a day',
              value: formatSecondsToHumanReadable(longestDay),
            },
            {
              label: 'Most pages in a day',
              value: mostPagesInADay,
            },
          ]}
        />
      </Box>
      <Title order={3} mb="lg">
        Last 7 days statistics
      </Title>
      <Statistics
        data={[
          {
            label: 'Total read time',
            value: formatSecondsToHumanReadable(sum(lastWeek?.map((stat) => stat.duration) ?? [])),
          },
          {
            label: 'Total pages read',
            value: uniqBy((stat: PageStat) => stat.page)(lastWeek ?? []).length,
          },
          {
            label: 'Average pages per day',
            value: Math.round(uniqBy((stat: PageStat) => stat.page)(lastWeek ?? []).length / 7),
          },
          {
            label: 'Average time per day',
            value: formatSecondsToHumanReadable(
              Math.round(sum(lastWeek?.map((stat) => stat.duration) ?? []))
            ),
          },
        ]}
      />
      <BarChart
        h={300}
        mt="xl"
        w="50vw"
        data={perDay}
        dataKey="day"
        valueFormatter={(value) => formatSecondsToHumanReadable(value)}
        series={[{ name: 'duration' }]}
        tickLine="y"
      />
      <Title order={3} my="lg">
        Time read per month
      </Title>
      <BarChart
        h={300}
        w="50vw"
        data={perMonth}
        dataKey="month"
        valueFormatter={(value) => formatSecondsToHumanReadable(value)}
        series={[{ name: 'duration' }]}
        tickLine="y"
      />
    </div>
  );
}
