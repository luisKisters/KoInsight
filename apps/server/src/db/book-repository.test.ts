import { Book, BookDevice, BookGenre, Device, GetAllBooksWithData } from '@koinsight/common/types';
import { db } from '../knex';
import { BookRepository } from './book-repository';
import { createBook, fakeBook } from './factories/book-factory';
import { createGenre, fakeGenre } from './factories/genre-factory';
import { createBookDevice } from './factories/book-device-factory';
import { createDevice } from './factories/device-factory';
import { O } from '@faker-js/faker/dist/airline-BUL6NtOJ';

describe(BookRepository, () => {
  describe('getAll', () => {
    it('returns an empty array when no books exist', async () => {
      const books = await BookRepository.getAll();
      expect(books).toHaveLength(0);
    });

    it('returns all books', async () => {
      await createBook(db, { title: 'Test Book' });
      await createBook(db, { title: 'Test Book 2' });

      const books = await BookRepository.getAll();

      expect(books).toHaveLength(2);
      expect(books[0].title).toBe('Test Book');
      expect(books[1].title).toBe('Test Book 2');
    });

    it('does not return soft deleted books', async () => {
      await createBook(db, { title: 'Test Book' });
      await createBook(db, { title: 'Test Book 2', soft_deleted: true });

      const books = await BookRepository.getAll();
      expect(books).toHaveLength(1);
      expect(books[0].title).toBe('Test Book');
    });
  });

  describe('getById', () => {
    it('gets a book by id', async () => {
      const book = await createBook(db, { title: 'Test Book' });
      const foundBook = await BookRepository.getById(book.id);

      expect(foundBook?.title).toEqual(book.title);
    });

    it('returns undefined for non-existent book', async () => {
      const foundBook = await BookRepository.getById(999);
      expect(foundBook).toBeUndefined();
    });
  });

  describe('insert', () => {
    it('inserts a book', async () => {
      const book = fakeBook({ title: 'Test Book', authors: 'Test Author' });

      const [id] = await BookRepository.insert(book);

      const insertedBook = await db<Book>('book').where({ id }).first();

      expect(insertedBook).toBeDefined();
      expect(insertedBook?.title).toEqual('Test Book');
      expect(insertedBook?.authors).toEqual('Test Author');
      expect(insertedBook?.md5).toEqual(book.md5);
    });
  });

  describe('update', () => {
    it('updates a book', async () => {
      const book = await createBook(db, { title: 'Test Book' });

      await BookRepository.update(book.id, { title: 'Updated Book' });

      const foundBook = await db<Book>('book').where({ id: book.id }).first();

      expect(foundBook?.title).toEqual('Updated Book');
    });
  });

  describe('softDelete', () => {
    it('soft deletes a book', async () => {
      const book = await createBook(db, { title: 'Test Book' });

      const result = await BookRepository.softDelete(book.id);

      expect(result).toEqual(1);

      const foundBook = await db<Book>('book').where({ id: book.id }).first();

      // knexjs returns boolean values as 0 or 1
      expect(foundBook?.soft_deleted).toBeTruthy();
    });

    it('returns 0 when a book is not found', async () => {
      const result = await BookRepository.softDelete(999);
      expect(result).toBe(0);
    });
  });

  describe('searchByTitle', () => {
    it('returns books matching the title', async () => {
      await createBook(db, { title: 'Test Book' });
      await createBook(db, { title: 'Another Book' });
      await createBook(db, { title: 'Test Book 2' });
      await createBook(db, { title: 'Test Book 3' });

      const books = await BookRepository.searchByTitle('Test Book');
      expect(books).toHaveLength(3);
      expect(books.map((book) => book.title)).toEqual(['Test Book', 'Test Book 2', 'Test Book 3']);
    });

    it('returns an empty array when no books match', async () => {
      await createBook(db, { title: 'Test Book' });
      await createBook(db, { title: 'Another Book' });
      await createBook(db, { title: 'Test Book 2' });
      await createBook(db, { title: 'Test Book 3' });

      const books = await BookRepository.searchByTitle('Non-existent Book');
      expect(books).toHaveLength(0);
    });

    it('returns an empty array when no books exist', async () => {
      const books = await BookRepository.searchByTitle('Test Book');
      expect(books).toHaveLength(0);
    });

    it('returns books with case-insensitive matches', async () => {
      await createBook(db, { title: 'Test Book' });
      await createBook(db, { title: 'Another Book' });
      await createBook(db, { title: 'Test Book 2' });
      await createBook(db, { title: 'TEST BOOK 3' });
      const books = await BookRepository.searchByTitle('test book');

      expect(books).toHaveLength(3);
      expect(books.map((book) => book.title)).toEqual(['Test Book', 'Test Book 2', 'TEST BOOK 3']);
    });
  });

  describe('getBookDeviceData', () => {
    it('returns book device data', async () => {
      const book = await createBook(db, { title: 'Test Book' });
      const device = await createDevice(db, { model: 'Kindle' });

      await createBookDevice(db, book, device, { last_open: 3, notes: 10 });

      const result = await BookRepository.getBookDeviceData(book.md5);

      expect(result).toHaveLength(1);
      expect(result[0].book_md5).toEqual(book.md5);
      expect(result[0].device_id).toEqual(device.id);
      expect(result[0].last_open).toEqual(3);
      expect(result[0].notes).toEqual(10);
    });

    it('returns an empty array when no book device data exists', async () => {
      const book = await createBook(db, { title: 'Test Book' });
      const result = await BookRepository.getBookDeviceData(book.md5);
      expect(result).toHaveLength(0);
    });

    it('returns an empty array when no book exists', async () => {
      const result = await BookRepository.getBookDeviceData('non-existent-book-md5');
      expect(result).toHaveLength(0);
    });

    it('returns an empty array when no device data exists', async () => {
      const book = await createBook(db, { title: 'Test Book' });
      const result = await BookRepository.getBookDeviceData(book.md5);
      expect(result).toHaveLength(0);
    });
  });

  describe('getAllWithData', () => {
    let result: GetAllBooksWithData[];
    let device1: Device;
    let device2: Device;
    let book1: Book;
    let book2: Book;

    beforeEach(async () => {
      book1 = await createBook(db, { title: 'Test Book 1' });
      book2 = await createBook(db, { title: 'Test Book 2' });
      await createBook(db, { title: 'Test Book 3' });

      device1 = await createDevice(db, { model: 'Kindle' });
      device2 = await createDevice(db, { model: 'Kobo' });

      const genre1 = await createGenre(db, { name: 'Test Genre 1' });
      const genre2 = await createGenre(db, { name: 'Test Genre 2' });
      await db<BookGenre>('book_genre').insert([
        { book_md5: book1.md5, genre_id: genre1.id },
        { book_md5: book1.md5, genre_id: genre2.id },
        { book_md5: book2.md5, genre_id: genre1.id },
      ]);
    });

    it('returns all books', async () => {
      result = await BookRepository.getAllWithData();
      expect(result).toHaveLength(3);
    });

    it('returns correct genres', async () => {
      result = await BookRepository.getAllWithData();
      expect(result[0].genres).toEqual([
        expect.objectContaining({ name: 'Test Genre 1' }),
        expect.objectContaining({ name: 'Test Genre 2' }),
      ]);
      expect(result[1].genres).toEqual([expect.objectContaining({ name: 'Test Genre 1' })]);
      expect(result[2].genres).toEqual([]);
    });

    it('returns correct device data', async () => {
      await createBookDevice(db, book1, device1, {
        last_open: 3,
        notes: 10,
        highlights: 10,
        pages: 100,
        total_read_time: 1000,
        total_read_pages: 20,
      });

      await createBookDevice(db, book1, device2, {
        last_open: 10,
        notes: 20,
        highlights: 20,
        pages: 150,
        total_read_time: 300,
        total_read_pages: 40,
      });

      result = await BookRepository.getAllWithData();

      expect(result[0].max_device_pages).toEqual(150);
      expect(result[0].last_open).toEqual(10);

      expect(result[0].device_data).toHaveLength(2);
      expect(result[0].genres).toHaveLength(2);

      // TODO: set expectaion on total_pages
      // TODO: set expectation on total_read_pages, but have to have page_stats inserted
      // expect(result[0].total_read_pages).toEqual(60);

      expect(result[0].total_read_time).toEqual(1300);

      expect(result[0].notes).toEqual(30);
      expect(result[0].highlights).toEqual(30);
    });
  });

  describe('addGenre', () => {
    it('adds a genre to a book', async () => {
      const book = await createBook(db, { title: 'Test Book' });
      const genre = await createGenre(db, { name: 'Test Genre' });

      await BookRepository.addGenre(book.md5, genre.name);

      const bookGenres = await db<BookGenre>('book_genre').where({ book_md5: book.md5 });

      expect(bookGenres).toHaveLength(1);
      expect(bookGenres[0].genre_id).toEqual(genre.id);
    });

    it('creates a new genre if it does not exist', async () => {
      expect(await db('genre').count('* as count')).toEqual([{ count: 0 }]);

      const book = await createBook(db, { title: 'Test Book' });
      const genreName = 'New Genre';

      await BookRepository.addGenre(book.md5, genreName);

      const genre = await db('genre').where({ name: genreName }).first();

      expect(genre).toBeDefined();

      const bookGenres = await db<BookGenre>('book_genre').where({ book_md5: book.md5 });

      expect(bookGenres).toHaveLength(1);
      expect(bookGenres[0].genre_id).toEqual(genre.id);
    });
  });

  describe('setReferencePages', () => {
    it('updates the reference pages for a book', async () => {
      const book = await createBook(db, { title: 'Test Book' });

      await BookRepository.setReferencePages(book.id, 101);

      const updatedBook = await db<Book>('book').where({ id: book.id }).first();

      expect(updatedBook?.reference_pages).toEqual(101);
    });

    it('returns 0 when a book is not found', async () => {
      expect(await BookRepository.setReferencePages(999, 101)).toEqual(0);
    });
  });
});
