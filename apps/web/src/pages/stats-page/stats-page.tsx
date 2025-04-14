import { Book } from '@koinsight/common/types/book';
import { PageStat } from '@koinsight/common/types/page-stat';
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
import { IconClock, IconMaximize, IconPageBreak } from '@tabler/icons-react';
import { format, startOfDay, subDays } from 'date-fns';
import { groupBy, sum } from 'ramda';
import { JSX, useMemo } from 'react';
import { BarProps } from 'recharts';
import { useBooks } from '../../api/books';
import { usePageStats } from '../../api/use-page-stats';
import { CustomBar } from '../../components/charts/custom-bar';
import { ReadingCalendar } from '../../components/statistics/reading-calendar';
import { Statistics } from '../../components/statistics/statistics';
import { formatSecondsToHumanReadable } from '../../utils/dates';
import { WeekStats } from './week-stats';

export function StatsPage(): JSX.Element {
  const colorScheme = useComputedColorScheme();
  const { colors } = useMantineTheme();
  const { data: books, isLoading } = useBooks();
  const {
    data: { stats, per_month },
    isLoading: statsLoading,
  } = usePageStats();

  console.log('stats', stats);

  const booksByMd5 = useMemo(() => {
    return books?.reduce(
      (acc, book) => {
        acc[book.md5] = book;
        return acc;
      },
      {} as Record<string, Book>
    );
  }, [books]);

  const lastWeek = useMemo(() => {
    const now = subDays(new Date(), 7);
    return stats.filter((stat) => stat.start_time * 1000 > now.getTime());
  }, [stats]);

  const weeklyReadTime = useMemo(
    () => sum(lastWeek?.map((stat) => stat.duration) ?? []),
    [lastWeek]
  );

  // const perMonth = useMemo(
  //   () =>
  //     (stats ?? [])
  //       .reduce<{ month: string; duration: number; date: number }[]>((acc, stat) => {
  //         const month = format(stat.start_time * 1000, 'MMMM yyyy');
  //         const monthData = acc.find((item) => item.month === month);
  //         if (monthData) {
  //           monthData.duration += stat.duration;
  //         } else {
  //           acc.push({ month, duration: stat.duration, date: stat.start_time });
  //         }

  //         return acc;
  //       }, [])
  //       .sort((a, b) => a.date - b.date),
  //   [stats]
  // );

  const longestDay = useMemo(() => {
    const timePerDay = stats.reduce<Record<number, number>>((acc, stat) => {
      const day = startOfDay(stat.start_time * 1000).getTime();
      acc[day] = (acc[day] || 0) + stat.duration;
      return acc;
    }, {});

    const maxTime = Math.max(...Object.values(timePerDay ?? []));
    return maxTime;
  }, [stats]);

  const pagesPerDay = useMemo(() => {
    const statsPerDay = groupBy((stat: PageStat) =>
      startOfDay(stat.start_time * 1000)
        .getTime()
        .toString()
    )(stats);

    const pagesPerDay = Object.values(statsPerDay).map(
      (dayStats) =>
        dayStats?.reduce((acc, stat) => {
          if (stat.total_pages && booksByMd5[stat.book_md5]?.reference_pages) {
            return acc + (1 / stat.total_pages) * booksByMd5[stat.book_md5].reference_pages!;
          } else {
            return acc + 1;
          }
        }, 0) ?? 0
    );

    return pagesPerDay;
  }, [stats, booksByMd5]);

  const mostPagesInADay = useMemo(() => Math.max(...pagesPerDay), [pagesPerDay]);

  const totalTime = useMemo(() => sum((stats ?? []).map((s) => s.duration)), [stats]);

  const perWeekDay = useMemo(
    () =>
      stats
        .reduce(
          (acc, stat) => {
            const day = format(stat.start_time * 1000, 'EEEE');
            const existingDay = acc.find((d) => d.name === day);
            if (existingDay) {
              existingDay.value += stat.duration;
            } else {
              acc.push({
                name: day,
                value: stat.duration,
                day: new Date(stat.start_time * 1000).getUTCDay(),
                index: 1,
              });
            }
            return acc;
          },
          [] as Array<{ name: string; value: number; day: number; index: number }>
        )
        .sort((a, b) => a.day - b.day),
    [stats]
  );

  const totalPagesRead = useMemo(() => {
    return books.reduce(
      (acc, book) =>
        book.reference_pages && book.reference_pages > 0
          ? acc + Math.round((book.total_read_pages / book.total_pages) * book.reference_pages)
          : acc + book.total_read_pages,
      0
    );
  }, [books]);

  if (isLoading || statsLoading || !books || !stats) {
    return (
      <Flex justify="center" align="center" h="100%">
        <Loader />
      </Flex>
    );
  }

  return (
    <>
      <Title mb="sm">Reading statistics</Title>
      <Text
        mt={4}
        mb="md"
        style={{ display: 'inline' }}
        variant="gradient"
        gradient={{
          from: colorScheme === 'dark' ? 'violet.4' : 'violet.8',
          to: colorScheme === 'dark' ? 'koinsight.5' : 'koinsight.8',
          deg: 120,
        }}
        fw={900}
      >
        {weeklyReadTime > 0 ? (
          <>You read for {formatSecondsToHumanReadable(weeklyReadTime)} this week. Keep it up!</>
        ) : (
          <>You haven't read this week yet. No better time to start!</>
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
              value: totalPagesRead,
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
        Weekly stats
      </Title>
      <WeekStats stats={stats} booksByMd5={booksByMd5} />
      <Title mt="xl" order={3}>
        Per day of the week
      </Title>
      <BarChart
        h={300}
        data={perWeekDay}
        dataKey="name"
        series={[
          {
            name: 'value',
            label: 'Reading time',
            color: colorScheme === 'dark' ? 'koinsight.7' : 'koinsight.1',
          },
        ]}
        gridAxis="none"
        withYAxis={false}
        barProps={{
          maxBarSize: 100,
          shape: (props: BarProps) => (
            <CustomBar
              {...props}
              accent={colorScheme === 'dark' ? colors.koinsight[2] : colors.koinsight[8]}
            />
          ),
        }}
        valueFormatter={(value) => formatSecondsToHumanReadable(value)}
      />
      <Title mt="xl" order={3}>
        Monthly reading time
      </Title>
      <BarChart
        h={300}
        mt="sm"
        data={per_month}
        dataKey="month"
        gridAxis="none"
        withYAxis={false}
        barProps={{
          maxBarSize: 100,
          shape: (props: BarProps) => (
            <CustomBar
              {...props}
              accent={colorScheme === 'dark' ? colors.violet[2] : colors.violet[8]}
            />
          ),
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
