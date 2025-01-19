import { Box, Flex, Group, Loader, Paper, RingProgress, Stack, Tabs, Text } from '@mantine/core';
import { IconApi, IconCalendar, IconPageBreak, IconTable } from '@tabler/icons-react';
import { sum } from 'ramda';
import { JSX } from 'react';
import { useParams } from 'react-router';
import { useBookWithStats } from '../../api/use-book-with-stats';
import { formatSecondsToHumanReadable } from '../../utils/dates';
import { BookCard } from './book-card';
import { BookPageCalendar } from './book-page-calendar';
import { BookPageOpenApi } from './book-page-open-api';
import { BookPageRaw } from './book-page-raw';
import { BookPageSelector } from './book-page-selector';

export function BookPage(): JSX.Element {
  const { id } = useParams() as { id: string };
  const { data: book, isLoading } = useBookWithStats(Number(id));

  const avgPerDay = book ? book.total_read_time / Object.keys(book.read_per_day).length : 0;

  if (isLoading || !book) {
    return (
      <Flex justify="center" align="center" h="100%">
        <Loader />
      </Flex>
    );
  }

  return (
    <Stack gap="md">
      <Group justify="space-between" gap="md">
        <BookCard book={book} />
        <Paper withBorder p="md" radius="md">
          <Text size="xs" c="dimmed" tt="uppercase">
            Reading progress
          </Text>
          <Group align="center" justify="center" h="100%">
            <div>
              <RingProgress
                label={
                  <Text size="xs" ta="center">
                    {book.total_read_pages} / {book.pages}
                  </Text>
                }
                sections={[
                  {
                    value: (book.total_read_pages / book.pages) * 100,
                    color: 'kobuddy',
                  },
                ]}
                w="100%"
              />
            </div>
            <Stack align="flex-start" gap={5}>
              <Text>Total read time: {formatSecondsToHumanReadable(book.total_read_time)}</Text>
              <Text>Average time per day: {formatSecondsToHumanReadable(avgPerDay)}</Text>
              <Text>Days reading: {Object.keys(book.read_per_day).length}</Text>
              <Text>
                Average time per page:{' '}
                {Math.round(sum(book.stats.map((p) => p.duration)) / book.stats.length)}s
              </Text>
            </Stack>
          </Group>
        </Paper>
      </Group>

      <Tabs defaultValue="calendar">
        <Tabs.List>
          <Tabs.Tab value="calendar" leftSection={<IconCalendar size={16} />}>
            Calendar
          </Tabs.Tab>
          <Tabs.Tab value="page-selector" leftSection={<IconPageBreak size={16} />}>
            Page Selector
          </Tabs.Tab>
          <Tabs.Tab value="raw-values" leftSection={<IconTable size={16} />}>
            Raw Values
          </Tabs.Tab>
          <Tabs.Tab value="open-library-api" leftSection={<IconApi size={18} />}>
            OpenLibrary API
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="calendar">
          <Box py={20}>
            <BookPageCalendar book={book} />
          </Box>
        </Tabs.Panel>

        <Tabs.Panel value="page-selector">
          <Box py={20}>
            <BookPageSelector book={book} />
          </Box>
        </Tabs.Panel>

        <Tabs.Panel value="raw-values">
          <Box py={20}>
            <BookPageRaw book={book} />
          </Box>
        </Tabs.Panel>

        <Tabs.Panel value="open-library-api">
          <Box py={20}>
            <BookPageOpenApi book={book} />
          </Box>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
