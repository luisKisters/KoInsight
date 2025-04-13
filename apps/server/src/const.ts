import path from 'path';

export const BASE_PATH = __dirname;
export const DATA_PATH = process.env.DATA_PATH || path.resolve(BASE_PATH, '../../../', 'data');

export const WEB_BUILD_PATH = path.join(BASE_PATH, '../../web/dist');

export const COVERS_PATH = path.resolve(DATA_PATH, 'covers');

export const UPLOAD_DB_FILENAME = 'statistics.sqlite3';
export const UPLOAD_DB_PATH = path.resolve(DATA_PATH, UPLOAD_DB_FILENAME);

export const DEV_DB_PATH = path.resolve(DATA_PATH, 'dev.sqlite3');
export const TEST_DB_PATH = path.resolve(DATA_PATH, 'test.sqlite3');
export const PROD_DB_PATH = path.resolve(DATA_PATH, 'prod.sqlite3');
