import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('genre', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();

    table.unique(['name']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('genre');
}
