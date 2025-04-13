import { db } from '../../src/knex';

beforeEach(async () => {
  await db.raw('PRAGMA foreign_keys = OFF');
  const tables = ['book', 'book_device', 'book_genre', 'device', 'genre', 'page_stat', 'user'];
  for (const table of tables) {
    await db(table).truncate();
  }
  await db.raw('PRAGMA foreign_keys = ON');
});
