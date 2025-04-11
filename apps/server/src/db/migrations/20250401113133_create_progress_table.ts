import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('progress', (table) => {
    table.increments('id').primary();
    table.integer('user_id').notNullable();
    table.string('document').notNullable();
    table.string('progress').notNullable();
    table.float('percentage').notNullable();
    table.string('device').notNullable();
    table.string('device_id').notNullable();

    table.timestamps(true, true);

    table.unique(['user_id', 'document', 'device_id']);
    table.foreign('user_id').references('id').inTable('user').onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('progress');
}
