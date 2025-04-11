import { PageStat } from '@koinsight/common/types/page-stat';
import { Knex } from 'knex';
import { SEED_BOOKS } from './01_books';
import { subDays, subHours, subMinutes } from 'date-fns';
import { Book } from '@koinsight/common/types/book';

function generateBookStats(book: Book): PageStat[] {
  const pageStats = [];
  const today = new Date();

  const startDate = subDays(today, Math.floor(Math.random() * 100));

  const maxPages = Math.min(book.pages ?? 0, 300);
  for (let i = 0; i < maxPages; i++) {
    pageStats.push({
      book_id: book.id,
      page: i,
      start_time: subMinutes(startDate, (maxPages - i) * 30).valueOf() / 1000,
      duration: Math.floor(Math.random() * 100),
      total_pages: book.pages,
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
