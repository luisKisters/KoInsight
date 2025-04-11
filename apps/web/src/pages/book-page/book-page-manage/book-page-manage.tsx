import { Book } from '@koinsight/common/types/book';
import { JSX } from 'react';
import { BookDelete } from './book-delete';
import { BookUploadCover } from './book-upload-cover';

type BookPageManageProps = {
  book: Book;
};

export function BookPageManage({ book }: BookPageManageProps): JSX.Element {
  return (
    <>
      <BookUploadCover book={book} />
      <BookDelete book={book} />
    </>
  );
}
