import knex from '../knex';
import { Book } from '@/common/types/book';

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
}
