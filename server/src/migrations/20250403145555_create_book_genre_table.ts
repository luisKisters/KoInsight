import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('book_genre', (table) => {
    table.increments('id').primary();
    table.integer('book_id').notNullable();
    table.integer('genre_id').notNullable();

    table.foreign('book_id').references('book.id');
    table.foreign('genre_id').references('genre.id');

    table.unique(['book_id', 'genre_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('book_genre');
}
