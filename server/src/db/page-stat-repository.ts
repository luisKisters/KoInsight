import { PageStat } from '@/common/types/page-stat';
import knex from '../knex';

export class PageStatRepository {
  static async getAll(): Promise<PageStat[]> {
    return knex<PageStat>('page_stat').select('*');
  }

  static async getByBookId(book_id: number): Promise<PageStat[]> {
    return knex<PageStat>('page_stat').where({ book_id });
  }

  static async insert(data: PageStat): Promise<number[]> {
    return knex<PageStat>('page_stat').insert(data);
  }

  static async update(
    book_id: number,
    page: number,
    start_time: number,
    data: Partial<PageStat>
  ): Promise<number> {
    return knex<PageStat>('page_stat').where({ book_id, page, start_time }).update(data);
  }

  static async delete(book_id: number, page: number, start_time: number): Promise<number> {
    return knex<PageStat>('page_stat').where({ book_id, page, start_time }).del();
  }

  static async getByUniqueKey(
    book_id: number,
    page: number,
    start_time: number
  ): Promise<PageStat | undefined> {
    return knex<PageStat>('page_stat').where({ book_id, page, start_time }).first();
  }
}
