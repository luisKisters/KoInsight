import { Device } from '@koinsight/common/types/device';
import { Knex } from 'knex';

function generateDevices(): Device[] {
  const deviceNames = ['Kindle', 'Kobo', 'Nook', 'iPad', 'Android Tablet'];

  return deviceNames.map((name, index) => ({
    id: `device-${index}`,
    model: name,
  }));
}

export const SEED_DEVICES = generateDevices();

export async function seed(knex: Knex): Promise<void> {
  await knex('device').del();
  return knex('device').insert(SEED_DEVICES);
}
