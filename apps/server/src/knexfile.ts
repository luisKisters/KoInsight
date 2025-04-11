import { Knex } from 'knex';
import { DEV_DB_PATH, PROD_DB_PATH } from './const';

const defaultConfig: Knex.Config = {
  useNullAsDefault: true,
  client: 'better-sqlite3',
};

const config: { [key: string]: Knex.Config } = {
  development: {
    ...defaultConfig,
    connection: { filename: DEV_DB_PATH },
    seeds: { directory: './db/seeds' },
    migrations: { directory: './db/migrations' },
  },
  production: {
    ...defaultConfig,
    connection: { filename: PROD_DB_PATH },
    useNullAsDefault: true,
    migrations: { directory: './db/migrations' },
  },
};

export default config;
