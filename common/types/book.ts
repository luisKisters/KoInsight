type KoReaderBook = {
  id: number;
  title: string;
  authors: string;
  notes: number | null;
  last_open: number | null;
  highlights: number | null;
  pages: number | null;
  series: string | null;
  language: string | null;
  md5: string | null;
  total_read_time: number | null;
  total_read_pages: number | null;
};

export type Book = KoReaderBook & {
  soft_deleted: boolean;
};
