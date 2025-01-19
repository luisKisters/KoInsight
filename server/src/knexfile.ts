import { Knex } from 'knex';
import path from 'path';
import { DATA_PATH } from './const';

export const DEV_DB_PATH = path.resolve(DATA_PATH, 'dev.sqlite3');
export const PROD_DB_PATH = path.resolve(DATA_PATH, 'prod.sqlite3');

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'better-sqlite3',
    connection: {
      filename: DEV_DB_PATH,
    },
    useNullAsDefault: true,
  },
  production: {
    client: 'better-sqlite3',
    connection: {
      filename: PROD_DB_PATH,
    },
    useNullAsDefault: true,
  },
};

export default config;
