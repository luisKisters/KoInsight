import { Book } from './book';
import { BookDevice } from './book-device';
import { Genre } from './genre';
import { PageStat } from './page-stat';

type Stats = {
  last_open: number;
  total_read_time: number;
  total_pages: number;
  total_read_pages: number;
  max_device_pages: number;
  notes: number;
  highlights: number;
};

type RelatedEntities = {
  device_data: BookDevice[];
  genres: Genre[];
};

export type BookWithData = Book &
  Stats &
  RelatedEntities & {
    stats: PageStat[];

    // Advanced metrics
    // total_read_pages: number;
    read_per_day: Record<string, number>;
    started_reading: number;
  };

export type GetAllBooksWithData = Book & Stats & RelatedEntities & {};
