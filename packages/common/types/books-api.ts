import { Book } from './book';
import { BookDevice } from './book-device';
import { Genre } from './genre';
import { PageStat } from './page-stat';

type Stats = {
  last_open: number;
  total_read_time: number;
  total_pages: number;
  total_read_pages: number;
};

export type BookWithData = Book &
  Stats & {
    device_data: BookDevice[];
    stats: PageStat[];
    genres: Genre[];

    // Advanced metrics total_read_pages: number;
    read_per_day: Record<string, number>;
    started_reading: number;
  };

export type GetAllBooksWithData = Book &
  Stats & {
    max_device_pages: number;
    genres: string[];
    device_data: BookDevice[];
    notes: number;
    highlights: number;
  };
