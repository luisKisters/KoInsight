import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('book', (table) => {
    table.increments('id').primary();
    table.text('title');
    table.text('authors');
    table.integer('notes');
    table.integer('last_open');
    table.integer('highlights');
    table.integer('pages');
    table.text('series');
    table.text('language');
    table.text('md5');
    table.integer('total_read_time');
    table.integer('total_read_pages');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('book');
}
