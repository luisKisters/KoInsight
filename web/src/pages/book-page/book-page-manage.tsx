import { Book } from '@/common/types/book';
import { Button, Flex, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { IconTrash } from '@tabler/icons-react';
import { JSX, useState } from 'react';
import { useNavigate } from 'react-router';
import { deleteBook } from '../../api/use-books';
import { RoutePath } from '../../routes';
import { mutate } from 'swr';

type BookPageManageProps = {
  book: Book;
};

export function BookPageManage({ book }: BookPageManageProps): JSX.Element {
  const navigate = useNavigate();

  const [deleteLoading, setDeleteLoading] = useState(false);

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
    <Flex align="center" gap="xs">
      <div>Delete book:</div>
      <Button
        size="xs"
        loading={deleteLoading}
        leftSection={<IconTrash size={16} />}
        variant="danger"
        onClick={openDeleteConfirm}
      >
        Delete
      </Button>
    </Flex>
  );
}
