import { faker } from '@faker-js/faker';
import { Device } from '@koinsight/common/types';

export function createDevice(overrides: Partial<Device> = {}): Device {
  const device: Device = {
    id: faker.string.uuid(),
    model: faker.helpers.arrayElement(['Kindle', 'Kobo', 'Nook', 'Note Air 3C']),
    ...overrides,
  };

  return device;
}
