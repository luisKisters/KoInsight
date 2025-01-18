import { JSX } from 'react';
import { Statistic, StatisticProps } from './statistic';
import { Flex } from '@mantine/core';

type StatisticsProps = {
  data: StatisticProps[];
};

export function Statistics({ data }: StatisticsProps): JSX.Element {
  return (
    <Flex gap="md" w="100%">
      {data.map((stat) => (
        <Statistic key={stat.label} label={stat.label} value={stat.value} />
      ))}
    </Flex>
  );
}
