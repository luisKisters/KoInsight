import { GetAllBooksWithData } from '@koinsight/common/types';
import { Book } from '@koinsight/common/types/book';
import { BookDevice } from '@koinsight/common/types/book-device';
import { Genre } from '@koinsight/common/types/genre';
import { db } from '../knex';
import { GenreRepository } from './genre-repository';
import { PageStatRepository } from './page-stat-repository';

export class BookRepository {
  static async getAll(): Promise<Book[]> {
    return db<Book>('book').select('*').where({ soft_deleted: false });
  }

  static async getById(id: number): Promise<Book | undefined> {
    return db<Book>('book').where({ id }).first();
  }

  static async insert(book: Partial<Book>): Promise<number[]> {
    return db<Book>('book').insert(book);
  }

  static async update(id: number, book: Partial<Book>): Promise<number> {
    return db<Book>('book').where({ id }).update(book);
  }

  static async softDelete(id: number): Promise<number> {
    return db<Book>('book').where({ id }).update({ soft_deleted: true });
  }

  static async delete(id: number): Promise<number> {
    return db<Book>('book').where({ id }).del();
  }

  static async searchByTitle(title: string): Promise<Book[]> {
    return db<Book>('book').where('title', 'like', `%${title}%`);
  }

  static async getBookDeviceData(md5: Book['md5']): Promise<BookDevice[]> {
    return db<BookDevice>('book_device').where({ book_md5: md5 });
  }

  private static mapGenreStringToArray(genreString?: string): Genre[] {
    return (
      genreString?.split(',').map((g: string) => {
        const [id, name] = g.split(':');
        return { id: Number(id), name };
      }) ?? []
    );
  }

  static async getAllWithData(): Promise<GetAllBooksWithData[]> {
    const books = await db('book')
      .select(
        'book.*',
        db.raw(`GROUP_CONCAT(genre.id || ':' || genre.name) as genres`),
        db.raw(`MAX(book_device.pages) as max_device_pages`),
        db.raw(`SUM(book_device.total_read_time) as total_read_time`),
        db.raw(`MAX(book_device.last_open) as last_open`)
      )
      .where({ 'book.soft_deleted': false })
      .leftJoin('book_genre', 'book.md5', 'book_genre.book_md5')
      .leftJoin('genre', 'book_genre.id', 'genre.id')
      .leftJoin('book_device', 'book.md5', 'book_device.book_md5')
      .groupBy('book.id');

    return Promise.all(
      books.map(async (book) => {
        const stats = await PageStatRepository.getByBookMD5(book.md5);

        const genres = book.genres?.split(',').map(this.mapGenreStringToArray) ?? [];
        return {
          ...book,
          genres,
          total_pages: Math.max(book.reference_pages, book.max_device_pages),
          total_read_pages: Math.round(
            stats.reduce((acc, stat) => {
              if (book.reference_pages) {
                return acc + (1 / stat.total_pages) * book.reference_pages;
              } else {
                return acc + 1;
              }
            }, 0)
          ),
        };
      })
    );
  }

  static async addGenre(id: number, genreName: string) {
    const genre = await GenreRepository.findOrCreate({ name: genreName });

    if (!genre) {
      throw new Error('Unable to find or create genre');
    }

    return db('book_genre').insert({ book_id: id, genre_id: genre.id });
  }

  static async setReferencePages(id: number, referencePages: number | null) {
    return db('book').where({ id }).update({ reference_pages: referencePages });
  }
}
