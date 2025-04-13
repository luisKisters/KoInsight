import { Book, BookDevice, DbPageStat, KoReaderBook, PageStat } from '@koinsight/common/types';
import knex from '../knex';

export function transformPageStats(pageStats: DbPageStat[]): PageStat[] {
  return pageStats.map(({ id_book, ...pageStat }) => ({
    ...pageStat,
  }));
}

export function uploadStatisticData(booksTomport: KoReaderBook[], newPageStats: PageStat[]) {
  return knex.transaction(async (trx) => {
    // Insert books
    const newBooks: Partial<Book>[] = booksTomport.map((book) => ({
      id: book.id,
      md5: book.md5,
      title: book.title,
      authors: book.authors,
      series: book.series,
      language: book.language,
    }));

    await Promise.all(
      newBooks.map(({ id, ...book }) => trx('book').insert(book).onConflict('md5').ignore())
    );

    const newBookDevices: Omit<BookDevice, 'id'>[] = booksTomport.map((book) => ({
      device_id: newPageStats[0].device_id || 'Unknown',
      book_md5: book.md5,
      last_open: book.last_open,
      pages: book.pages,
      notes: book.notes,
      highlights: book.highlights,
      total_read_pages: book.total_read_pages,
      total_read_time: book.total_read_time,
    }));

    await Promise.all(
      newBookDevices.map((bookDevice) =>
        trx('book_device')
          .insert(bookDevice)
          .onConflict(['book_md5', 'device_id'])
          .merge([
            'last_open',
            'pages',
            'notes',
            'highlights',
            'total_read_time',
            'total_read_pages',
          ])
      )
    );

    // Insert page stats
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
