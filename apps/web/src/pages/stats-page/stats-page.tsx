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
import { startOfDay, subDays } from 'date-fns';
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
    data: { stats, perMonth, perDayOfTheWeek },
    isLoading: statsLoading,
  } = usePageStats();

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
    return stats.filter((stat) => stat.start_time > now.getTime());
  }, [stats]);

  const weeklyReadTime = useMemo(
    () => sum(lastWeek?.map((stat) => stat.duration) ?? []),
    [lastWeek]
  );

  const longestDay = useMemo(() => {
    const timePerDay = stats.reduce<Record<number, number>>((acc, stat) => {
      const day = startOfDay(stat.start_time).getTime();
      acc[day] = (acc[day] || 0) + stat.duration;
      return acc;
    }, {});

    const maxTime = Math.max(...Object.values(timePerDay ?? []));
    return maxTime;
  }, [stats]);

  const pagesPerDay = useMemo(() => {
    const statsPerDay = groupBy((stat: PageStat) =>
      startOfDay(stat.start_time).getTime().toString()
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
        data={perDayOfTheWeek}
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
        data={perMonth}
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
