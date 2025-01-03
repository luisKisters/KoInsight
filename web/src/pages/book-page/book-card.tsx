import { Group, Image, Text, Tooltip } from '@mantine/core';
import {
  IconBooks,
  IconCalendar,
  IconClock,
  IconHighlight,
  IconNote,
  IconProgress,
  IconUser,
} from '@tabler/icons-react';
import { JSX } from 'react';
import { API_URL } from '../../api/api';
import { Book } from '../../api/use-books';
import { formatRelativeDate, formatSecondsToHumanReadable } from '../../utils/dates';

type BookCardProps = {
  book: Book;
};

export function BookCard({ book }: BookCardProps): JSX.Element {
  return (
    <div>
      <Group wrap="nowrap">
        <Image
          src={`${API_URL}/books/${book.id}/cover`}
          h={140}
          alt={book.title}
          radius="md"
          fallbackSrc="/book-placeholder-small.png"
        />
        <div>
          <Group wrap="nowrap" gap={10} mt={3}>
            <Tooltip label="Author" position="top" withArrow>
              <IconUser stroke={1.5} size={16} />
            </Tooltip>
            <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
              {book.authors ?? 'N/A'}
            </Text>
          </Group>

          <Text fz="xl" fw={700}>
            {book.title}
          </Text>

          <Group wrap="nowrap" gap={10}>
            <Tooltip label="Series" position="top" withArrow>
              <IconBooks stroke={1.5} size={16} />
            </Tooltip>
            <Text fz="xs" c="dimmed">
              {book.series}
            </Text>
          </Group>
          <Group wrap="nowrap" gap={10} mt={5}>
            <Tooltip label="Pages read" position="top" withArrow>
              <IconProgress stroke={1.5} size={16} />
            </Tooltip>
            <Text fz="xs" c="dimmed">
              {book.total_read_pages}
              &nbsp;/&nbsp;
              {book.pages} pages read
            </Text>
          </Group>

          <Group wrap="nowrap" gap={10} mt={5}>
            <Tooltip label="Total read time" position="top" withArrow>
              <IconClock stroke={1.5} size={16} />
            </Tooltip>
            <Text fz="xs" c="dimmed">
              {formatSecondsToHumanReadable(book.total_read_time)}
            </Text>
          </Group>

          <Group wrap="nowrap" gap={10} mt={5}>
            <Tooltip label="Last opened" position="top" withArrow>
              <IconCalendar stroke={1.5} size={16} />
            </Tooltip>
            <Text fz="xs" c="dimmed">
              {formatRelativeDate(book.last_open * 1000)}
            </Text>
          </Group>

          <Group>
            <Group wrap="nowrap" gap={10} mt={5}>
              <Tooltip label="Highlights" position="top" withArrow>
                <IconHighlight stroke={1.5} size={16} />
              </Tooltip>
              <Text fz="xs" c="dimmed">
                {book.highlights}
              </Text>
            </Group>

            <Group wrap="nowrap" gap={10} mt={5}>
              <Tooltip label="Notes" position="top" withArrow>
                <IconNote stroke={1.5} size={16} />
              </Tooltip>
              <Text fz="xs" c="dimmed">
                {book.notes}
              </Text>
            </Group>
          </Group>
        </div>
      </Group>
    </div>
  );
}
