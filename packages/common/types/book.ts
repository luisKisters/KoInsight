import { Genre } from './genre';

type KoReaderBook = {
  id: number;
  title: string;
  authors: string;
  notes: number;
  last_open: number;
  highlights: number;
  pages: number;
  series: string;
  language: string;
  md5: string;
  total_read_time: number;
  total_read_pages: number;
};

export type Book = KoReaderBook & {
  soft_deleted: boolean;
  reference_pages: number | null;
};

export type BookWithGenres = Book & {
  genres: Genre[];
};
