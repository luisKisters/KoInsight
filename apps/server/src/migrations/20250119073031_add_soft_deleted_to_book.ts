import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('book', (table) => {
    table.boolean('soft_deleted').defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('book', (table) => {
    table.dropColumn('soft_deleted');
  });
}
