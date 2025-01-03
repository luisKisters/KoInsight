import { JSX, useMemo } from 'react';
import { useBooks } from '../api/use-books';
import { usePageStats } from '../api/use-page-stats';
import { Flex, Loader, Text } from '@mantine/core';
import { BarChart } from '@mantine/charts';
import { format } from 'date-fns';
import { formatSecondsToHumanReadable } from '../utils/dates';

export function StatsPage(): JSX.Element {
  const { data: books, isLoading } = useBooks();
  const { data: stats, isLoading: statsLoading } = usePageStats();

  const perMonth = (stats ?? []).reduce<{ month: string; duration: number }[]>((acc, stat) => {
    const month = format(stat.start_time * 1000, 'MMMM yyyy');
    const monthData = acc.find((item) => item.month === month);
    if (monthData) {
      monthData.duration += stat.duration;
    } else {
      acc.push({ month, duration: stat.duration });
    }

    return acc;
  }, []);

  const totalTime = (stats ?? []).reduce((acc, stat) => acc + stat.duration, 0);

  if (isLoading || statsLoading || !books || !stats) {
    return (
      <Flex justify="center" align="center" h="100%">
        <Loader />
      </Flex>
    );
  }

  return (
    <div>
      <Text>
        Total read time: <strong>{formatSecondsToHumanReadable(totalTime)}</strong>
      </Text>
      <Text mb="lg">
        Total read pages:{' '}
        <strong>{books.reduce((acc, book) => acc + book.total_read_pages, 0)}</strong>
      </Text>
      <Text mb="lg">Time read per month</Text>
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
