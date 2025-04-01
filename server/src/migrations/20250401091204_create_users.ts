import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('user', (table) => {
    table.increments('id').primary();
    table.string('username').notNullable();
    table.string('password_hash').notNullable();
    table.timestamps(true, true);

    table.unique(['username']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('user');
}
