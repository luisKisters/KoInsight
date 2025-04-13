import { faker } from '@faker-js/faker';
import { Book, BookDevice, Device } from '@koinsight/common/types';

type FakeBookDevice = Omit<BookDevice, 'id'>;

export function createBookDevice(
  book: Book,
  device: Device,
  overrides: Partial<FakeBookDevice> = {}
): FakeBookDevice {
  const bookDevice: FakeBookDevice = {
    book_md5: book.md5,
    device_id: device.id,
    last_open: faker.date.past().getTime(),
    notes: faker.number.int({ min: 0, max: 100 }),
    highlights: faker.number.int({ min: 0, max: 100 }),
    pages: faker.number.int({ min: 0, max: 100 }),
    total_read_time: faker.number.int({ min: 0, max: 100 }),
    total_read_pages: faker.number.int({ min: 0, max: 100 }),
    ...overrides,
  };

  return bookDevice;
}
