import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('book', (table) => {
    table.increments('id').primary();
    table.text('title');
    table.text('authors');
    table.integer('notes').defaultTo(0);
    table.integer('last_open').defaultTo(0);
    table.integer('highlights').defaultTo(0);
    table.integer('pages').defaultTo(0);
    table.text('series');
    table.text('language');
    table.text('md5');
    table.integer('total_read_time').defaultTo(0);
    table.integer('total_read_pages').defaultTo(0);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('book');
}
