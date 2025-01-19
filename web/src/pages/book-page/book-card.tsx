import { Button, Group, Image, Text, Tooltip } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import {
  IconBooks,
  IconCalendar,
  IconHighlight,
  IconNote,
  IconProgress,
  IconTrash,
  IconUser,
} from '@tabler/icons-react';
import { JSX, useState } from 'react';
import { useNavigate } from 'react-router';
import { mutate } from 'swr';
import { API_URL } from '../../api/api';
import { BookWithStats } from '../../api/use-book-with-stats';
import { deleteBook } from '../../api/use-books';
import { RoutePath } from '../../routes';
import { formatRelativeDate } from '../../utils/dates';

type BookCardProps = {
  book: BookWithStats;
};

export function BookCard({ book }: BookCardProps): JSX.Element {
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();

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
      await deleteBook(book.id);
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

  return (
    <Group>
      <Image
        src={`${API_URL}/books/${book.id}/cover`}
        h={200}
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
        <Button
          mt="lg"
          size="xs"
          loading={deleteLoading}
          leftSection={<IconTrash size={16} />}
          variant="danger"
          onClick={openDeleteConfirm}
        >
          Delete
        </Button>
      </div>
    </Group>
  );
}
