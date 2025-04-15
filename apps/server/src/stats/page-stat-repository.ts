import { PageStat } from '@koinsight/common/types/page-stat';
import { db } from '../knex';

export class PageStatRepository {
  static async getAll(): Promise<PageStat[]> {
    return db<PageStat>('page_stat').select('*');
  }

  static async getByBookMD5(book_md5: string): Promise<PageStat[]> {
    return db<PageStat>('page_stat').where({ book_md5 });
  }

  static async insert(data: PageStat): Promise<number[]> {
    return db<PageStat>('page_stat').insert(data);
  }

  static async update(
    book_md5: string,
    device_id: string,
    page: number,
    start_time: number,
    data: Partial<PageStat>
  ): Promise<number> {
    return db<PageStat>('page_stat').where({ book_md5, device_id, page, start_time }).update(data);
  }
}
