import { Book } from '@koinsight/common/types/book';
import { JSX } from 'react';
import { BookDelete } from './book-delete';
import { BookUploadCover } from './book-upload-cover';
import { BookReferencePages } from './book-reference-pages';
import { Flex, Stack } from '@mantine/core';

type BookPageManageProps = {
  book: Book;
};

export function BookPageManage({ book }: BookPageManageProps): JSX.Element {
  return (
    <Flex direction="column" align="flex-start" gap="xl">
      <BookReferencePages book={book} />
      <BookUploadCover book={book} />
      <BookDelete book={book} />
    </Flex>
  );
}
