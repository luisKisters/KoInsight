import path from 'path';

export const BASE_PATH = process.cwd();
export const DATA_PATH = process.env.DATA_PATH || path.resolve(BASE_PATH, '../', 'data');

export const COVERS_PATH = path.resolve(DATA_PATH, 'covers');

export const DB_FILENAME = 'statistics.sqlite3';
export const DB_PATH = path.resolve(DATA_PATH, DB_FILENAME);
