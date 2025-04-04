import { BarChart } from '@mantine/charts';
import {
  Box,
  Flex,
  Loader,
  Text,
  Title,
  useComputedColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { IconArrowsVertical, IconClock, IconMaximize, IconPageBreak } from '@tabler/icons-react';
import { format, formatDate, isSameDay, startOfDay, subDays } from 'date-fns';
import { range, sum, uniqBy } from 'ramda';
import { JSX, useMemo } from 'react';
import { useBooks } from '../api/use-books';
import { PageStat, usePageStats } from '../api/use-page-stats';
import { ReadingCalendar } from '../components/statistics/reading-calendar';
import { Statistics } from '../components/statistics/statistics';
import { formatSecondsToHumanReadable } from '../utils/dates';
import { BarProps } from 'recharts';

const CustomBar = (props: BarProps & { accent: string }) => {
  const { x, y, width, height, fill, accent } = props;
  return (
    <>
      <rect x={x} y={y} width={width} height={height} fill={fill} />
      {height && height > 0 && <rect x={x} y={y} width={width} height={2} fill={accent} />}
    </>
  );
};

export function StatsPage(): JSX.Element {
  const colorScheme = useComputedColorScheme();
  const { colors } = useMantineTheme();
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

  const weeklyReadTime = useMemo(
    () => sum(lastWeek?.map((stat) => stat.duration) ?? []),
    [lastWeek]
  );

  if (isLoading || statsLoading || !books || !stats) {
    return (
      <Flex justify="center" align="center" h="100%">
        <Loader />
      </Flex>
    );
  }

  return (
    <>
      <Title mb="sm">Reading history</Title>

      <Text
        mt={4}
        mb="md"
        style={{ display: 'inline' }}
        variant="gradient"
        gradient={{
          from: colorScheme === 'dark' ? 'violet.4' : 'violet.8',
          to: colorScheme === 'dark' ? 'kobuddy.5' : 'kobuddy.8',
          deg: 120,
        }}
        fw={600}
      >
        {weeklyReadTime > 0 ? (
          <>You read for {formatSecondsToHumanReadable(weeklyReadTime)} this week. Keep it up!</>
        ) : (
          <>You haven't read this week yet.</>
        )}
      </Text>
      <Box my="xl">
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
      <Title mb="xl" order={3}>
        Reading history
      </Title>
      <Box mb="xl">
        <ReadingCalendar />
      </Box>

      <Title mt="xl" mb={4} order={3}>
        Last 7 days
      </Title>
      <Text c="kobuddy" tt="uppercase" mb="md" size="sm" fw={600}>
        {formatDate(subDays(new Date(), 7), 'dd MMM')} - {formatDate(new Date(), 'dd MMM')}
      </Text>
      <Statistics
        data={[
          {
            label: 'Read time',
            value: formatSecondsToHumanReadable(sum(lastWeek?.map((stat) => stat.duration) ?? [])),
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
        mt="sm"
        data={perDay}
        dataKey="day"
        gridAxis="none"
        withYAxis={false}
        barProps={{
          maxBarSize: 100,
          shape: (props: BarProps) => <CustomBar {...props} accent={colors.kobuddy[8]} />,
        }}
        valueFormatter={(value) => formatSecondsToHumanReadable(value)}
        series={[
          {
            name: 'duration',
            label: 'Reading time',
            color: colorScheme === 'dark' ? 'kobuddy.8' : 'kobuddy.1',
          },
        ]}
      />

      <Title mt="xl" order={3}>
        Monthly reading time
      </Title>
      <BarChart
        h={300}
        mt="sm"
        data={perMonth}
        dataKey="month"
        gridAxis="none"
        withYAxis={false}
        barProps={{
          maxBarSize: 100,
          shape: (props: BarProps) => <CustomBar {...props} accent={colors.violet[8]} />,
        }}
        valueFormatter={(value) => formatSecondsToHumanReadable(value)}
        series={[
          {
            name: 'duration',
            label: 'Reading time',
            color: colorScheme === 'dark' ? 'violet.7' : 'violet.1',
          },
        ]}
      />
    </>
  );
}
