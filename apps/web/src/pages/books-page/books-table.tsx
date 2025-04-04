import { Book } from '@kobuddy/common/types/book';
import { Anchor, Flex, Image, Progress, Stack, Table, Text, Tooltip } from '@mantine/core';
import { IconHighlight, IconNote } from '@tabler/icons-react';
import { JSX } from 'react';
import { NavLink } from 'react-router';
import { API_URL } from '../../api/api';
import { getBookPath } from '../../routes';
import { formatRelativeDate, getDuration, shortDuration } from '../../utils/dates';

import style from './books-table.module.css';

type BooksTableProps = {
  books: Book[];
};

export function BooksTable({ books }: BooksTableProps): JSX.Element {
  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Title</Table.Th>
          <Table.Th style={{ width: '200px' }} visibleFrom="md">
            Read
          </Table.Th>
          <Table.Th visibleFrom="md">Pages</Table.Th>
          <Table.Th visibleFrom="md">Total read time</Table.Th>
          <Table.Th visibleFrom="md">Last open</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {books.map((book) => (
          <Table.Tr key={book.id}>
            <Table.Td>
              <Flex align="center" gap="sm">
                <Anchor to={getBookPath(book.id)} component={NavLink}>
                  <Image
                    src={`${API_URL}/books/${book.id}/cover`}
                    style={{ aspectRatio: '1/1.5' }}
                    h={60}
                    fit="contain"
                    alt={book.title}
                    fallbackSrc="/book-placeholder-small.png"
                    radius="sm"
                  />
                </Anchor>
                <Stack gap={0} justify="center">
                  <Anchor to={getBookPath(book.id)} component={NavLink}>
                    {book.title}
                  </Anchor>
                  <Text className={style.SubTitle}>
                    {book.authors ?? 'N/A'} · {book.series} ·&nbsp;
                    <Tooltip label="Highlights" withArrow>
                      <Flex align="center">
                        <IconHighlight size={13} />
                        &nbsp;{book.highlights}
                      </Flex>
                    </Tooltip>
                    &nbsp;·&nbsp;
                    <Tooltip label="Notes" withArrow>
                      <Flex align="center">
                        <IconNote size={13} />
                        &nbsp;{book.notes}
                      </Flex>
                    </Tooltip>
                  </Text>
                </Stack>
              </Flex>
            </Table.Td>
            <Table.Td visibleFrom="md">
              {book.total_read_pages}
              <Progress
                value={(book.total_read_pages / book.pages) * 100}
                aria-label="Percentage read"
                aria-valuetext={String((book.total_read_pages / book.pages) * 100)}
              />
            </Table.Td>
            <Table.Td visibleFrom="md">{book.pages}</Table.Td>
            <Table.Td visibleFrom="md">
              {book.total_read_time ? shortDuration(getDuration(book.total_read_time)) : 'N/A'}
            </Table.Td>
            <Table.Td visibleFrom="md">{formatRelativeDate(book.last_open * 1000)}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}
