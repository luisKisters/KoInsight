import { Book } from '@kobuddy/common/types/book';
import { Box, Group, Image, Progress, Text, Tooltip } from '@mantine/core';
import { IconBooks, IconProgress, IconUser } from '@tabler/icons-react';
import { JSX } from 'react';
import { useNavigate } from 'react-router';
import { API_URL } from '../../api/api';
import { getBookPath } from '../../routes';

import style from './books-cards.module.css';

type BooksCardsProps = {
  books: Book[];
};

export function BooksCards({ books }: BooksCardsProps): JSX.Element {
  const navigate = useNavigate();

  return (
    <div className={style.CardGrid}>
      {books.map((book) => (
        <Box
          key={book.id}
          className={style.Card}
          role="button"
          onClick={() => navigate(getBookPath(book.id))}
        >
          <Image
            src={`${API_URL}/books/${book.id}/cover`}
            style={{ aspectRatio: '1/1.5' }}
            w="200px"
            alt={book.title}
            fallbackSrc="/book-placeholder-small.png"
          />
          <Progress
            radius={0}
            h={5}
            value={(book.total_read_pages / book.pages) * 100}
            color="kobuddy"
          />
          <Box px="lg" className={style.CardDetails}>
            <Text fz="md" fw={600} style={{ wordBreak: 'break-word', whiteSpace: 'wrap' }}>
              {book.title}
            </Text>
            <Group wrap="nowrap" gap={8} mt="xs">
              <Tooltip label="Author" position="top" withArrow>
                <IconUser stroke={1.5} size={16} />
              </Tooltip>
              <span className={style.Attribute}>{book.authors ?? 'N/A'}</span>
            </Group>
            <Group wrap="nowrap" gap={8}>
              <Tooltip label="Series" position="top" withArrow>
                <IconBooks stroke={1.5} size={16} />
              </Tooltip>
              <span className={style.Attribute}>{book.series}</span>
            </Group>
            <Group wrap="nowrap" gap={8}>
              <Tooltip label="Pages read" position="top" withArrow>
                <IconProgress stroke={1.5} size={16} />
              </Tooltip>
              <span className={style.Attribute}>
                {book.total_read_pages}
                &nbsp;/&nbsp;
                {book.pages} pages read
              </span>
            </Group>
          </Box>
        </Box>
      ))}
    </div>
  );
}
