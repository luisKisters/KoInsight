import knex from 'knex';
import config from '../../src/knexfile';

export default async () => {
  const db = knex(config['test']);
  await db.migrate.latest({ directory: './src/db/migrations' });
  await db.destroy(); // ✅ cleanly close it
};
