import { Book } from '@koinsight/common/types/book';
import { Button, Flex, Group, Loader, Select, TextInput, Title, Tooltip } from '@mantine/core';
import { useLocalStorage, useMediaQuery } from '@mantine/hooks';
import {
  IconArrowsDownUp,
  IconCards,
  IconSortAscending,
  IconSortDescending,
  IconTable,
  IconX,
} from '@tabler/icons-react';
import { JSX, useState } from 'react';
import { useBooks } from '../../api/use-books';
import { EmptyState } from '../../components/empty-state/empty-state';
import { BooksCards } from './books-cards';
import { BooksTable } from './books-table';

import style from './books-page.module.css';

export function BooksPage(): JSX.Element {
  const media = useMediaQuery(`(max-width: 62em)`);

  const [mode, setMode] = useLocalStorage<'table' | 'cards'>({
    key: 'koinsight-books-search',
    defaultValue: 'table',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useLocalStorage<{ key: keyof Book; direction: 'asc' | 'desc' }>({
    key: 'koinsight-books-sort',
    defaultValue: {
      key: 'last_open',
      direction: 'desc',
    },
  });

  const { data: books, isLoading, error } = useBooks();

  const visibleBooks =
    searchTerm.length === 0
      ? (books ?? [])
      : (books ?? []).filter((book) =>
          [book.title, book.authors, book.series]
            .map((value) => value?.toLowerCase())
            .some((v) => v?.includes(searchTerm.toLowerCase()))
        );

  const sortedBooks = visibleBooks.sort((a, b) => {
    const { key: sort, direction } = sortBy;
    const aVal = a[sort];
    const bVal = b[sort];

    if (aVal === null) {
      return 1;
    }

    if (bVal === null) {
      return -1;
    }

    const dir = direction === 'asc' ? 1 : -1;
    if (aVal < bVal) {
      return -1 * dir;
    }
    if (aVal > bVal) {
      return 1 * dir;
    }

    return 0;
  });

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
    return (
      <>
        <Title mb="xl">Books</Title>
        <EmptyState
          title="No books yet"
          description="It seems like you haven't uploaded any reading statistics yet."
        />
      </>
    );
  }

  return (
    <>
      <Title mb="xl">Books</Title>
      <div className={style.Controls}>
        <TextInput
          placeholder="Search books..."
          w={media ? '100%' : 300}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          rightSection={
            searchTerm.length > 0 ? (
              <IconX size={14} onClick={() => setSearchTerm('')} style={{ cursor: 'pointer' }} />
            ) : null
          }
        />
        <Group align="center">
          <Button
            variant="default"
            onClick={() =>
              setSortBy({
                key: sortBy.key,
                direction: sortBy.direction === 'asc' ? 'desc' : 'asc',
              })
            }
          >
            {sortBy.direction === 'asc' ? (
              <IconSortAscending size={18} />
            ) : (
              <IconSortDescending size={18} />
            )}
          </Button>
          <Select
            leftSection={<IconArrowsDownUp size={16} />}
            w={150}
            value={sortBy.key}
            allowDeselect={false}
            onChange={(value) => setSortBy((prev) => ({ ...prev, key: value as keyof Book }))}
            data={
              [
                { label: 'Added', value: 'id' },
                { label: 'Title', value: 'title' },
                { label: 'Author', value: 'authors' },
                { label: 'Read time', value: 'total_read_time' },
                { label: 'Last open', value: 'last_open' },
              ] as { label: string; value: keyof Book }[]
            }
            defaultValue="title"
          />
          <Button.Group variant="default">
            <Tooltip label="Table view" position="top" withArrow>
              <Button
                variant={mode === 'table' ? 'filled' : 'default'}
                onClick={() => setMode('table')}
              >
                <IconTable size={16} />
              </Button>
            </Tooltip>
            <Tooltip label="Cards view" position="top" withArrow>
              <Button
                variant={mode === 'cards' ? 'filled' : 'default'}
                onClick={() => setMode('cards')}
              >
                <IconCards size={16} />
              </Button>
            </Tooltip>
          </Button.Group>
        </Group>
      </div>
      {mode === 'table' ? <BooksTable books={sortedBooks} /> : <BooksCards books={sortedBooks} />}
    </>
  );
}
