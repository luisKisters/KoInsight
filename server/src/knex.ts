import knex, { Knex } from 'knex';
import config from './knexfile';

const environment = process.env.NODE_ENV || 'development';
const knexInstance: Knex = knex(config[environment]);

export default knexInstance;
