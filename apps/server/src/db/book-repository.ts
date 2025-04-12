import knex from '../knex';
import { Book, BookWithGenres } from '@koinsight/common/types/book';
import { GenreRepository } from './genre-repository';
import { Genre } from '@koinsight/common/types/genre';

export class BookRepository {
  static async getAll(): Promise<Book[]> {
    return knex<Book>('book').select('*').where({ soft_deleted: false });
  }

  static async getById(id: number): Promise<Book | undefined> {
    return knex<Book>('book').where({ id }).first();
  }

  static async insert(book: Partial<Book>): Promise<number[]> {
    return knex<Book>('book').insert(book);
  }

  static async update(id: number, book: Partial<Book>): Promise<number> {
    return knex<Book>('book').where({ id }).update(book);
  }

  static async softDelete(id: number): Promise<number> {
    return knex<Book>('book').where({ id }).update({ soft_deleted: true });
  }

  static async delete(id: number): Promise<number> {
    return knex<Book>('book').where({ id }).del();
  }

  static async searchByTitle(title: string): Promise<Book[]> {
    return knex<Book>('book').where('title', 'like', `%${title}%`);
  }

  private static mapGenreStringToArray(genreString?: string): Genre[] {
    return (
      genreString?.split(',').map((g: string) => {
        const [id, name] = g.split(':');
        return { id: Number(id), name };
      }) ?? []
    );
  }

  static async getAllWithGenres(): Promise<BookWithGenres[]> {
    const books = await knex('book')
      .select('book.*', knex.raw(`GROUP_CONCAT(genre.id || ':' || genre.name) as genres`))
      .where({ 'book.soft_deleted': false })
      .leftJoin('book_genre', 'book.id', 'book_genre.book_id')
      .leftJoin('genre', 'book_genre.id', 'genre.id')
      .groupBy('book.id');

    return books.map((book) => {
      const genres = book.genres?.split(',').map(this.mapGenreStringToArray) ?? [];
      return { ...book, genres };
    });
  }

  static async getByIdWithGenres(id: Book['id']): Promise<BookWithGenres[]> {
    const book = await knex('book')
      .select('book.*', knex.raw(`GROUP_CONCAT(genre.id || ':' || genre.name) as genres`))
      .where({ 'book.id': id })
      .leftJoin('book_genre', 'book.id', 'book_genre.book_id')
      .leftJoin('genre', 'book_genre.id', 'genre.id')
      .groupBy('book.id')
      .first();

    return {
      ...book,
      genres: this.mapGenreStringToArray(book.genres),
    };
  }

  static async addGenre(id: number, genreName: string) {
    const genre = await GenreRepository.findOrCreate({ name: genreName });

    if (!genre) {
      throw new Error('Unable to find or create genre');
    }

    return knex('book_genre').insert({ book_id: id, genre_id: genre.id });
  }

  static async setReferencePages(id: number, referencePages: number | null) {
    return knex('book').where({ id }).update({ reference_pages: referencePages });
  }
}
