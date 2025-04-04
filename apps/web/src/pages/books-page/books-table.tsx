import { Book } from '@kobuddy/common/types/book';
import { Anchor, Progress, Table } from '@mantine/core';
import { JSX } from 'react';
import { Link } from 'react-router';
import { getBookPath } from '../../routes';
import { formatRelativeDate, formatSecondsToHumanReadable } from '../../utils/dates';

type BooksTableProps = {
  books: Book[];
};

export function BooksTable({ books }: BooksTableProps): JSX.Element {
  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Title</Table.Th>
          <Table.Th>Author</Table.Th>
          <Table.Th>Series</Table.Th>
          <Table.Th style={{ width: '200px' }}>Read</Table.Th>
          <Table.Th>Pages</Table.Th>
          <Table.Th>Total read time</Table.Th>
          <Table.Th>Last open</Table.Th>
          <Table.Th>Notes</Table.Th>
          <Table.Th>Highlights</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {books.map((book) => (
          <Table.Tr key={book.id}>
            <Table.Th>
              <Anchor to={getBookPath(book.id)} component={Link}>
                {book.title}
              </Anchor>
            </Table.Th>
            <Table.Td>{book.authors ?? 'N/A'}</Table.Td>
            <Table.Td>{book.series}</Table.Td>
            <Table.Td>
              {book.total_read_pages}
              <Progress
                value={(book.total_read_pages / book.pages) * 100}
                aria-label="Percentage read"
                aria-valuetext={String((book.total_read_pages / book.pages) * 100)}
              />
            </Table.Td>
            <Table.Td>{book.pages}</Table.Td>
            <Table.Td>{formatSecondsToHumanReadable(book.total_read_time)}</Table.Td>
            <Table.Td>{formatRelativeDate(book.last_open * 1000)}</Table.Td>
            <Table.Td>{book.notes}</Table.Td>
            <Table.Td>{book.highlights}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}
