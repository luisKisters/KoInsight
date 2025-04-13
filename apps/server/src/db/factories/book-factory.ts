import { Book } from '@koinsight/common/types';
import { faker } from '@faker-js/faker';

type FakeBook = Omit<Book, 'id' | 'soft_deleted'>;

export function createBook(overrides: Partial<FakeBook> = {}): FakeBook {
  const book: FakeBook = {
    title: faker.book.title(),
    md5: faker.string.alphanumeric(32),
    reference_pages: faker.number.int({ min: 50, max: 300 }),
    authors: faker.book.author(),
    series: faker.book.series(),
    language: faker.location.language().alpha2,
    ...overrides,
  };

  return book;
}
