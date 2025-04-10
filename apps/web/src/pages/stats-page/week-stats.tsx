import { AreaChart } from '@mantine/charts';
import { Flex, Popover, Text, useComputedColorScheme, useMantineTheme } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import {
  IconArrowsVertical,
  IconCaretDownFilled,
  IconClock,
  IconPageBreak,
} from '@tabler/icons-react';
import { addDays, endOfWeek, format, formatDate, isBefore, isSameDay, startOfWeek } from 'date-fns';
import { sum, uniqBy } from 'ramda';
import { useMemo, useState } from 'react';
import { PageStat } from '../../api/use-page-stats';
import { Statistics } from '../../components/statistics/statistics';
import { formatSecondsToHumanReadable } from '../../utils/dates';

export function WeekStats({ stats }: { stats: PageStat[] }) {
  const [weekStart, setWeekStart] = useState<number>(
    startOfWeek(new Date(), { weekStartsOn: 1 }).getTime()
  );
  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });

  const colorScheme = useComputedColorScheme();
  const { colors } = useMantineTheme();

  const weekData = useMemo(() => {
    const start = startOfWeek(weekStart, { weekStartsOn: 1 });
    return stats?.filter(
      ({ start_time }) =>
        start_time * 1000 < weekEnd.getTime() && start_time * 1000 > start.getTime()
    );
  }, [stats, weekStart, weekEnd]);

  const perDay = useMemo(() => {
    const perDayResult = [];

    let day = weekStart;
    while (isBefore(day, weekEnd)) {
      const dayStats = stats?.filter((stat) => isSameDay(stat.start_time * 1000, day)) ?? [];

      perDayResult.push({
        day: format(day, 'dd MMM yyyy'),
        duration: sum(dayStats.map((s) => s.duration)),
      });

      day = addDays(day, 1).getTime();
    }

    return perDayResult;
  }, [stats, weekStart, weekEnd]);

  return (
    <>
      <Popover position="bottom-start">
        <Popover.Target>
          <Flex align="center" mb="md" gap={4} style={{ cursor: 'pointer' }}>
            <Text c="violet.4" tt="uppercase" size="sm" fw={600}>
              {formatDate(weekStart, 'dd MMM')} - {formatDate(weekEnd, 'dd MMM')}
            </Text>
            <IconCaretDownFilled size={16} color={colors.violet[6]} />
          </Flex>
        </Popover.Target>
        <Popover.Dropdown>
          <DatePicker
            value={new Date(weekStart)}
            maxDate={endOfWeek(new Date())}
            onChange={(date) =>
              date && setWeekStart(startOfWeek(date, { weekStartsOn: 1 }).getTime())
            }
          />
        </Popover.Dropdown>
      </Popover>
      <Statistics
        data={[
          {
            label: 'Read time',
            value: formatSecondsToHumanReadable(sum(weekData?.map((stat) => stat.duration) ?? [])),
            icon: IconClock,
          },
          {
            label: 'Pages read',
            value: uniqBy((stat: PageStat) => stat.page)(weekData ?? []).length,
            icon: IconPageBreak,
          },
          {
            label: 'Average pages per day',
            value: Math.round(uniqBy((stat: PageStat) => stat.page)(weekData ?? []).length / 7),
            icon: IconArrowsVertical,
          },
          {
            label: 'Average time per day',
            value: formatSecondsToHumanReadable(
              Math.round(sum(weekData?.map((stat) => stat.duration) ?? []) / 7)
            ),
            icon: IconClock,
          },
        ]}
      />
      <AreaChart
        h={300}
        mt="sm"
        data={perDay}
        dataKey="day"
        gridAxis="none"
        withYAxis={false}
        type="stacked"
        valueFormatter={(value) => formatSecondsToHumanReadable(value)}
        curveType="monotone"
        series={[
          {
            name: 'duration',
            label: 'Reading time',
            color: colorScheme === 'dark' ? 'violet.3' : 'violet.7',
          },
        ]}
      />
    </>
  );
}
