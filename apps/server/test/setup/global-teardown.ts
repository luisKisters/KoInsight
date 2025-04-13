import { db } from '../../src/knex';

export default async () => {
  await db.destroy();
};
