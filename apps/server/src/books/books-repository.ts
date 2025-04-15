import { BookGenre, GetAllBooksWithData } from '@koinsight/common/types';
import { Book } from '@koinsight/common/types/book';
import { BookDevice } from '@koinsight/common/types/book-device';
import { Genre } from '@koinsight/common/types/genre';
import { db } from '../knex';
import { GenreRepository } from '../genres/genre-repository';
import { StatsRepository } from '../stats/stats-repository';
import { sum } from 'ramda';

export class BooksRepository {
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

  static async searchByTitle(title: string): Promise<Book[]> {
    return db<Book>('book').where('title', 'like', `%${title}%`);
  }

  static async getBookDeviceData(md5: Book['md5']): Promise<BookDevice[]> {
    return db<BookDevice>('book_device').where({ book_md5: md5 });
  }

  static async getAllWithData(): Promise<GetAllBooksWithData[]> {
    const books = await db('book')
      .select(
        'book.*',
        db.raw(`(
          SELECT json_group_array(
            json_object('id', genre.id, 'name', genre.name)
          )
          FROM book_genre
          JOIN genre ON genre.id = book_genre.genre_id
          WHERE book_genre.book_md5 = book.md5
        ) as genres`),
        db.raw(`(
          SELECT json_group_array(
            json_object(
              'id', bd.id,
              'device_id', bd.device_id,
              'last_open', bd.last_open,
              'notes', bd.notes,
              'highlights', bd.highlights,
              'pages', bd.pages,
              'total_read_time', bd.total_read_time,
              'total_read_pages', bd.total_read_pages
            )
          )
          FROM book_device bd
          WHERE bd.book_md5 = book.md5
        ) as book_devices`)
      )
      .where({ 'book.soft_deleted': false });

    return Promise.all(
      books.map(async (book) => {
        const stats = await StatsRepository.getByBookMD5(book.md5);

        const genres = JSON.parse(book.genres) as Genre[];
        const bookDevices = JSON.parse(book.book_devices) as BookDevice[];

        const maxDevicePages = Math.max(...bookDevices.map((device) => device.pages));

        const totalPages = Math.max(book.reference_pages, maxDevicePages);

        const lastOpen = Math.max(...bookDevices.map((device) => device.last_open));

        const totalReadTime = sum(bookDevices.map((device) => device.total_read_time));

        const totalReadPages = Math.round(
          stats.reduce((acc, stat) => {
            if (book.reference_pages) {
              return acc + (1 / stat.total_pages) * book.reference_pages;
            } else {
              return acc + 1;
            }
          }, 0)
        );

        const { genres: raw_genres, book_devices, ...book_props } = book;

        return {
          ...book_props,
          genres: genres,
          device_data: bookDevices,
          max_device_pages: maxDevicePages,
          total_pages: totalPages,
          total_read_pages: totalReadPages,
          total_read_time: totalReadTime,
          last_open: lastOpen,
          highlights: sum(bookDevices.map((device) => device.highlights)),
          notes: sum(bookDevices.map((device) => device.notes)),
        };
      })
    );
  }

  static async addGenre(md5: Book['md5'], genreName: string) {
    const genre = await GenreRepository.findOrCreate({ name: genreName });
    return db<BookGenre>('book_genre').insert({ book_md5: md5, genre_id: genre.id });
  }

  static async setReferencePages(id: number, referencePages: number | null) {
    return db<Book>('book').where({ id }).update({ reference_pages: referencePages });
  }
}
