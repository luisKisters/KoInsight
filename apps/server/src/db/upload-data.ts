import { Book } from '@kobuddy/common/types/book';
import { DbPageStat, PageStat } from '@kobuddy/common/types/page-stat';
import knex from '../knex';

export function transformPageStats(pageStats: DbPageStat[]): PageStat[] {
  return pageStats.map(({ id_book, ...pageStat }) => ({
    ...pageStat,
    book_id: id_book,
  }));
}

export function uploadStatisticData(newBooks: Book[], newPageStats: PageStat[]) {
  return knex.transaction(async (trx) => {
    await Promise.all(
      newBooks.map((book) =>
        trx('book')
          .insert(book)
          .onConflict('id')
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

    console.log('newPageStats', newPageStats);
    await Promise.all(
      // TODO: Figure out if onConflict here is viable. What if the book is read from 2 different devices?
      newPageStats.map((pageStat) => trx('page_stat').insert(pageStat).onConflict().ignore())
    );

    await trx.commit();
  });
}
