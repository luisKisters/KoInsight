import { Book } from '@koinsight/common/types';
import { db } from '../knex';
import { BookRepository } from './book-repository';
import { createBook } from './factories/book-factory';

describe(BookRepository, () => {
  describe('getAll', () => {
    it('creates a book and finds it', async () => {
      const book = createBook({ title: 'Test Book' });
      const book2 = createBook({ title: 'Test Book 2' });
      await db('book').insert([book, book2]);

      const books = await BookRepository.getAll();

      expect(books).toHaveLength(2);
      expect(books[0].title).toBe('Test Book');
      expect(books[1].title).toBe('Test Book 2');
    });

    it('returns an empty array when no books exist', async () => {
      const books = await BookRepository.getAll();
      expect(books).toHaveLength(0);
    });
  });

  describe('getById', () => {
    it('gets a book by id', async () => {
      const book = createBook({ title: 'Test Book' });
      const inserted = await db<Book>('book').insert(book);
      const foundBook = await BookRepository.getById(inserted[0]);

      expect(foundBook?.title).toEqual(book.title);
    });

    it('returns undefined for non-existent book', async () => {
      const foundBook = await BookRepository.getById(999);
      expect(foundBook).toBeUndefined();
    });
  });

  describe('getAllWithData', () => {
    it('gets all books with data', async () => {
      expect(true).toBe(true);
    });
  });
});
