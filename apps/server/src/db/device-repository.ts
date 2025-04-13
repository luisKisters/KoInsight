import { Device } from '@koinsight/common/types/device';
import { db } from '../knex';

export class DeviceRepository {
  static async getAll(): Promise<Device[]> {
    return db<Device>('device').select('*');
  }

  static async getById(id: string): Promise<Device | undefined> {
    return db<Device>('device').where({ id }).first();
  }

  static async insertIfNotExists(device: Device): Promise<void> {
    const existingDevice = await this.getById(device.id);

    if (!existingDevice) {
      await db<Device>('device').insert(device);
    }
  }
}
