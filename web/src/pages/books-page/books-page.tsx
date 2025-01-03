import { Button, Flex, Loader, TextInput, Tooltip } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { IconCards, IconTable, IconX } from '@tabler/icons-react';
import { JSX, useState } from 'react';
import { useBooks } from '../../api/use-books';
import { BooksCards } from './books-cards';
import { BooksTable } from './books-table';

export function BooksPage(): JSX.Element {
  const [mode, setMode] = useLocalStorage<'table' | 'cards'>({
    key: 'kobuddy-books-search',
    defaultValue: 'table',
  });

  const [searchTerm, setSearchTerm] = useState('');

  const { data: books, isLoading, error } = useBooks();

  const visibleBooks =
    searchTerm.length === 0
      ? books ?? []
      : (books ?? []).filter((book) =>
          [book.title, book.authors, book.series]
            .map((value) => value.toLowerCase())
            .some((v) => v.includes(searchTerm.toLowerCase()))
        );

  if (error) {
    return <Flex justify="center">Failed to load books</Flex>;
  }

  if (isLoading || !books) {
    return (
      <Flex justify="center" align="center" h="100%">
        <Loader />
      </Flex>
    );
  }

  if (books.length === 0) {
    return <Flex justify="center">No books found</Flex>;
  }

  return (
    <>
      <Flex justify="space-between">
        <TextInput
          placeholder="Search books..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          rightSection={
            searchTerm.length > 0 ? (
              <IconX size={14} onClick={() => setSearchTerm('')} style={{ cursor: 'pointer' }} />
            ) : null
          }
        />
        <Button.Group mb="xl">
          <Tooltip label="Table view" position="top" withArrow>
            <Button
              size="xs"
              variant={mode === 'table' ? 'primary' : 'light'}
              onClick={() => setMode('table')}
            >
              <IconTable size={16} />
            </Button>
          </Tooltip>
          <Tooltip label="Cards view" position="top" withArrow>
            <Button
              size="xs"
              variant={mode === 'cards' ? 'primary' : 'light'}
              onClick={() => setMode('cards')}
            >
              <IconCards size={16} />
            </Button>
          </Tooltip>
        </Button.Group>
      </Flex>
      {mode === 'table' ? <BooksTable books={visibleBooks} /> : <BooksCards books={visibleBooks} />}
    </>
  );
}
