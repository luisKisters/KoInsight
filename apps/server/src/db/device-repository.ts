import { Device } from '@koinsight/common/types/device';
import knex from '../knex';

export class DeviceRepository {
  static async getAll(): Promise<Device[]> {
    return knex<Device>('device').select('*');
  }

  static async getById(id: string): Promise<Device | undefined> {
    return knex<Device>('device').where({ id }).first();
  }

  static async insertIfNotExists(device: Device): Promise<void> {
    const existingDevice = await this.getById(device.id);

    if (!existingDevice) {
      await knex<Device>('device').insert(device);
    }
  }
}
