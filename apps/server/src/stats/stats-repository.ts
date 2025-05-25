import { PageStat } from '@koinsight/common/types/page-stat';
import { db } from '../knex';

export class StatsRepository {
  private static updateStartTime(stat: PageStat): PageStat {
    return { ...stat, start_time: stat.start_time * 1000 };
  }

  static async getAll(): Promise<PageStat[]> {
    const stats = await db<PageStat>('page_stat').select('*');
    return stats.map(this.updateStartTime);
  }

  static async getByBookMD5(book_md5: string): Promise<PageStat[]> {
    const bookStats = await db<PageStat>('page_stat').where({ book_md5 });
    return bookStats.map(this.updateStartTime);
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
