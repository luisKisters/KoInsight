import { Book } from '@koinsight/common/types/book';
import { PageStat } from '@koinsight/common/types/page-stat';
import { subDays, subMinutes } from 'date-fns';
import { Knex } from 'knex';
import { SEED_BOOKS } from './01_books';
import { SEED_DEVICES } from './02_devices';

function generateBookStats(book: Book): PageStat[] {
  const pageStats: PageStat[] = [];
  const today = new Date();

  const startDate = subDays(today, Math.floor(Math.random() * 100));

  const maxPages = Math.min(0, 300);
  for (let i = 0; i < maxPages; i++) {
    pageStats.push({
      page: i,
      start_time: subMinutes(startDate, (maxPages - i) * 30).valueOf() / 1000,
      duration: Math.floor(Math.random() * 100),
      total_pages: Math.floor(Math.random() * maxPages),
      device_id: SEED_DEVICES[Math.floor(Math.random() * SEED_DEVICES.length)].id,
      book_md5: book.md5,
    });
  }

  return pageStats;
}

export async function seed(knex: Knex): Promise<void> {
  await knex('page_stat').del();

  await Promise.all(
    SEED_BOOKS.map((book) => {
      const pageStats = generateBookStats(book as Book);
      return knex('page_stat').insert(pageStats);
    })
  );
}
