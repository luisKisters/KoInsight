import { Genre } from '@koinsight/common/types/genre';
import knex from '../knex';

type GenreCreate = Omit<Genre, 'id'>;

export class GenreRepository {
  static async getAll(): Promise<Genre[]> {
    return knex<Genre>('genre').select('*');
  }

  static async getByName(name: string): Promise<Genre | undefined> {
    return knex<Genre>('genre').where({ name }).first();
  }

  static async getByBookMd5(md5: string): Promise<Genre[]> {
    return knex<Genre>('genre')
      .select('genre.name')
      .join('book_genre', 'book_genre.id', 'genre.id')
      .where({ 'book_genre.book_md5': md5 });
  }

  static async create(genre: GenreCreate): Promise<Genre | undefined> {
    return (await knex<Genre>('genre').insert(genre).returning('*')).at(0);
  }

  static async findOrCreate(genre: GenreCreate): Promise<Genre | undefined> {
    const existingGenre = await this.getByName(genre.name);

    if (existingGenre) {
      return existingGenre;
    } else {
      return this.create(genre);
    }
  }
}
