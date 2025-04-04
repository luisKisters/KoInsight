import { Knex } from 'knex';
import { DEV_DB_PATH, PROD_DB_PATH } from './const';

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'better-sqlite3',
    connection: { filename: DEV_DB_PATH },
    useNullAsDefault: true,
  },
  production: {
    client: 'better-sqlite3',
    connection: { filename: PROD_DB_PATH },
    useNullAsDefault: true,
  },
};

export default config;
