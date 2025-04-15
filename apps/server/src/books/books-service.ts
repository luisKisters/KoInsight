import { Book, BookWithData } from '@koinsight/common/types';
import { startOfDay } from 'date-fns';
import { GenreRepository } from '../genres/genre-repository';
import { StatsRepository } from '../stats/stats-repository';
import { BooksRepository } from './books-repository';

export class BooksService {
  static async withData(book: Book): Promise<BookWithData> {
    const stats = await StatsRepository.getByBookMD5(book.md5);
    const device_data = await BooksRepository.getBookDeviceData(book.md5);
    const genres = await GenreRepository.getByBookMd5(book.md5);

    const total_pages =
      book.reference_pages || Math.max(...device_data.map((device) => device.pages || 0));

    const total_read_time = device_data.reduce((acc, device) => acc + device.total_read_time, 0);

    const started_reading = stats.reduce((acc, stat) => Math.min(acc, stat.start_time), Infinity);

    const last_open = device_data.reduce((acc, device) => Math.max(acc, device.last_open), 0);

    const read_per_day = stats.reduce(
      (acc, stat) => {
        const day = startOfDay(stat.start_time).getTime();
        acc[day] = (acc[day] || 0) + stat.duration;

        return acc;
      },
      {} as Record<string, number>
    );

    const total_read_pages = Math.round(
      stats.reduce((acc, stat) => {
        if (book.reference_pages) {
          return acc + (1 / stat.total_pages) * book.reference_pages;
        } else {
          return acc + 1;
        }
      }, 0)
    );

    const response: BookWithData = {
      ...book,
      stats,
      device_data,
      started_reading,
      read_per_day,
      total_read_time,
      total_read_pages,
      total_pages,
      last_open,
      genres,
      notes: device_data.reduce((acc, device) => acc + device.notes, 0),
      highlights: device_data.reduce((acc, device) => acc + device.highlights, 0),
      max_device_pages: Math.max(...device_data.map((device) => device.pages || 0)),
    };

    return response;
  }
}
