import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('page_stat', (table) => {
    table.increments('id').primary();
    table.integer('book_id').notNullable();
    table.integer('page').notNullable().defaultTo(0);
    table.integer('start_time').notNullable().defaultTo(0);
    table.integer('duration').notNullable().defaultTo(0);
    table.integer('total_pages').notNullable().defaultTo(0);

    table.unique(['book_id', 'page', 'start_time']);
    table.foreign('book_id').references('book.id').onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('page_stat');
}
