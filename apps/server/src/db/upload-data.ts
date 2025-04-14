import { Book, BookDevice, Device, KoReaderBook, PageStat } from '@koinsight/common/types';
import { db } from '../knex';

export function uploadStatisticData(booksToImport: KoReaderBook[], newPageStats: PageStat[]) {
  return db.transaction(async (trx) => {
    // Insert books
    const newBooks: Partial<Book>[] = booksToImport.map((book) => ({
      id: book.id,
      md5: book.md5,
      title: book.title,
      authors: book.authors,
      series: book.series,
      language: book.language,
    }));

    await Promise.all(
      newBooks.map(({ id, ...book }) => trx<Book>('book').insert(book).onConflict('md5').ignore())
    );

    const UNKNOWN_DEVICE_ID = 'manual-upload';
    const hasUnknownDevices = newPageStats[0].device_id === UNKNOWN_DEVICE_ID;

    if (hasUnknownDevices) {
      let unknownDevice = await trx<Device>('device').where({ id: UNKNOWN_DEVICE_ID }).first();

      if (!unknownDevice) {
        console.log('Creating unknown device');
        await trx<Device>('device').insert({ id: UNKNOWN_DEVICE_ID, model: 'Manual Upload' });
      }
    }

    const newBookDevices: Omit<BookDevice, 'id'>[] = booksToImport.map((book) => ({
      device_id: newPageStats[0].device_id,
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
        trx<BookDevice>('book_device')
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
        trx<PageStat>('page_stat')
          .insert(pageStat)
          .onConflict(['device_id', 'book_md5', 'page', 'start_time'])
          .merge(['duration', 'total_pages'])
      )
    );

    await trx.commit();
  });
}
