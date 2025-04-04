import { Flex, Group, Image, Text, Tooltip } from '@mantine/core';
import {
  IconBooks,
  IconCalendar,
  IconHighlight,
  IconNote,
  IconProgress,
  IconUser,
} from '@tabler/icons-react';
import { JSX } from 'react';
import { API_URL } from '../../api/api';
import { BookWithStats } from '../../api/use-book-with-stats';
import { formatRelativeDate } from '../../utils/dates';

import style from './book-card.module.css';

type BookCardProps = {
  book: BookWithStats;
};

export function BookCard({ book }: BookCardProps): JSX.Element {
  return (
    <Flex align="center" gap="xs">
      <Image
        src={`${API_URL}/books/${book.id}/cover`}
        h={250}
        alt={book.title}
        radius="md"
        fallbackSrc="/book-placeholder-small.png"
      />
      <div>
        <Flex align="center" gap={10} mt={3}>
          <Tooltip label="Author" position="top" withArrow>
            <IconUser stroke={1.5} size={16} />
          </Tooltip>
          <span className={style.Author}>{book.authors ?? 'N/A'}</span>
        </Flex>

        <Text fz="xl" fw="800">
          {book.title}
        </Text>

        <Flex align="center" gap={10} mt="sm">
          <Tooltip label="Series" position="top" withArrow>
            <IconBooks stroke={1.5} size={16} />
          </Tooltip>
          <span className={style.InfoText}>{book.series}</span>
        </Flex>
        <Flex align="center" gap={10} mt={5}>
          <Tooltip label="Pages read" position="top" withArrow>
            <IconProgress stroke={1.5} size={16} />
          </Tooltip>
          <span className={style.InfoText}>
            {book.total_read_pages}
            &nbsp;/&nbsp;
            {book.pages} pages read
          </span>
        </Flex>

        <Flex align="center" gap={10} mt={5}>
          <Tooltip label="Last opened" position="top" withArrow>
            <IconCalendar stroke={1.5} size={16} />
          </Tooltip>
          <span className={style.InfoText}>{formatRelativeDate(book.last_open * 1000)}</span>
        </Flex>

        <Group>
          <Flex align="center" gap={10} mt={5}>
            <Tooltip label="Highlights" position="top" withArrow>
              <IconHighlight stroke={1.5} size={16} />
            </Tooltip>
            <span className={style.InfoText}>{book.highlights}</span>
          </Flex>

          <Flex align="center" gap={10} mt={5}>
            <Tooltip label="Notes" position="top" withArrow>
              <IconNote stroke={1.5} size={16} />
            </Tooltip>
            <span className={style.InfoText}>{book.notes}</span>
          </Flex>
        </Group>
      </div>
    </Flex>
  );
}
