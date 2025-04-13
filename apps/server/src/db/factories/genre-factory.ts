import { faker } from '@faker-js/faker';
import { Genre } from '@koinsight/common/types';

type FakeGenre = Omit<Genre, 'id'>;

export function createGenre(overrides: Partial<FakeGenre> = {}): FakeGenre {
  const genre: FakeGenre = {
    name: faker.book.genre(),
    ...overrides,
  };

  return genre;
}
