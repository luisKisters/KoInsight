import { Box, Button, Flex, Loader, Tabs, Text } from '@mantine/core';
import { IconApi, IconCalendar, IconPageBreak, IconTable, IconTrash } from '@tabler/icons-react';
import { JSX, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useBookWithStats } from '../../api/use-book-with-stats';
import { BookCard } from './book-card';
import { BookPageCalendar } from './book-page-calendar';
import { BookPageRaw } from './book-page-raw';
import { BookPageSelector } from './book-page-selector';
import { BookPageOpenApi } from './book-page-open-api';
import { deleteBook } from '../../api/use-books';
import { notifications } from '@mantine/notifications';
import { mutate } from 'swr';
import { RoutePath } from '../../routes';
import { modals } from '@mantine/modals';

export function BookPage(): JSX.Element {
  const { id } = useParams() as { id: string };
  const navigate = useNavigate();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { data: book, isLoading } = useBookWithStats(Number(id));

  const openDeleteConfirm = () =>
    modals.openConfirmModal({
      title: 'Delete Book?',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete {book ? `"${book?.title}"` : 'this book'}? This action is
          destructive and cannot be reverted.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: "No, don't delete it" },
      confirmProps: { color: 'red' },
      onConfirm: handleDelete,
    });

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await deleteBook(id);
      await mutate('books');
      navigate(RoutePath.HOME);
      notifications.show({
        title: 'Book deleted',
        message: `${book ? `"${book?.title}"` : 'Book'} deleted successfully.`,
        color: 'green',
        position: 'top-center',
      });
    } catch (error) {
      notifications.show({
        title: 'Failed to delete the book',
        message: 'Failed to delete the book.',
        color: 'red',
        position: 'top-center',
      });
    }
  };

  if (isLoading || !book) {
    return (
      <Flex justify="center" align="center" h="100%">
        <Loader />
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap={20}>
      <Flex justify="space-between" align="start">
        <BookCard book={book} />
        <Button
          loading={deleteLoading}
          leftSection={<IconTrash size={16} />}
          variant="danger"
          onClick={openDeleteConfirm}
        >
          Delete
        </Button>
      </Flex>

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
    </Flex>
  );
}
