import { Book } from '@koinsight/common/types/book';
import { DbPageStat, PageStat } from '@koinsight/common/types/page-stat';
import knex from '../knex';

export function transformPageStats(pageStats: DbPageStat[]): PageStat[] {
  return pageStats.map(({ id_book, ...pageStat }) => ({
    ...pageStat,
  }));
}

export function uploadStatisticData(newBooks: Book[], newPageStats: PageStat[]) {
  return knex.transaction(async (trx) => {
    await Promise.all(
      newBooks.map(({ id, ...book }) =>
        trx('book')
          .insert(book)
          .onConflict('md5')
          .merge([
            'pages',
            'last_open',
            'total_read_time',
            'total_read_pages',
            'notes',
            'highlights',
          ])
      )
    );

    await Promise.all(
      newPageStats.map((pageStat) =>
        trx('page_stat')
          .insert(pageStat)
          .onConflict(['device_id', 'book_md5', 'page', 'start_time'])
          .merge(['duration', 'total_pages'])
      )
    );

    await trx.commit();
  });
}
